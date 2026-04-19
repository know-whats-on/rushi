#!/usr/bin/env ruby

require "xcodeproj"

project_path = File.expand_path("../ios/App/App.xcodeproj", __dir__)
project = Xcodeproj::Project.open(project_path)

app_target = project.targets.find { |target| target.name == "App" }
abort("App target not found.") unless app_target

def ensure_group(parent, name)
  parent.children.find { |child| child.respond_to?(:display_name) && child.display_name == name } ||
    parent.new_group(name)
end

def ensure_file(group, path)
  group.files.find { |file| file.path == path } || group.new_file(path)
end

app_group = project.main_group.children.find do |child|
  child.respond_to?(:display_name) && child.display_name == "App"
end
abort("App group not found.") unless app_group

remote_widget_group = ensure_group(app_group, "RemoteWidget")

shared_file_paths = %w[
  PresentationRemoteWidgetConfig.swift
  RemoteWidgetSharedStore.swift
  RemoteWidgetAPI.swift
]

app_only_file_paths = %w[
  RemoteWidgetSetupView.swift
  RemoteWidgetSetupCoordinator.swift
  RemoteWidgetSetupPlugin.swift
  StudioBridgeViewController.swift
]

widget_only_file_paths = %w[
  PresentationRemoteWidgetIntents.swift
  PresentationRemoteWidget.swift
  PresentationRemoteWidgetBundle.swift
]

support_file_paths = %w[
  App.entitlements
  PresentationRemoteWidgetExtension.entitlements
  PresentationRemoteWidgetExtension-Info.plist
]

shared_refs = shared_file_paths.map { |path| ensure_file(remote_widget_group, path) }
app_only_refs = app_only_file_paths.map { |path| ensure_file(remote_widget_group, path) }
widget_only_refs = widget_only_file_paths.map { |path| ensure_file(remote_widget_group, path) }
support_file_paths.each { |path| ensure_file(remote_widget_group, path) }

widget_target_name = "PresentationRemoteWidgetExtension"
widget_target = project.targets.find { |target| target.name == widget_target_name }
unless widget_target
  widget_target = project.new_target(:app_extension, widget_target_name, :ios, "17.0")
end

app_target.add_file_references(shared_refs + app_only_refs)
widget_target.add_file_references(shared_refs + widget_only_refs)

app_target.add_dependency(widget_target) unless app_target.dependencies.any? { |dependency| dependency.target == widget_target }

embed_phase = app_target.copy_files_build_phases.find { |phase| phase.name == "Embed App Extensions" } ||
  app_target.new_copy_files_build_phase("Embed App Extensions")
embed_phase.dst_subfolder_spec = "13"

unless embed_phase.files_references.include?(widget_target.product_reference)
  build_file = embed_phase.add_file_reference(widget_target.product_reference, true)
  build_file.settings = { "ATTRIBUTES" => %w[RemoveHeadersOnCopy CodeSignOnCopy] }
end

development_team = app_target.build_configurations
  .map { |config| config.build_settings["DEVELOPMENT_TEAM"] }
  .compact
  .first

marketing_version = app_target.build_configurations
  .map { |config| config.build_settings["MARKETING_VERSION"] }
  .compact
  .first || "1.0"

current_project_version = app_target.build_configurations
  .map { |config| config.build_settings["CURRENT_PROJECT_VERSION"] }
  .compact
  .first || "1"

project.root_object.attributes["TargetAttributes"] ||= {}
project.root_object.attributes["TargetAttributes"][widget_target.uuid] ||= {}
project.root_object.attributes["TargetAttributes"][widget_target.uuid]["ProvisioningStyle"] = "Automatic"
project.root_object.attributes["TargetAttributes"][widget_target.uuid]["DevelopmentTeam"] = development_team if development_team

app_target.build_configurations.each do |config|
  config.build_settings["CODE_SIGN_ENTITLEMENTS"] = "App/App.entitlements"
end

widget_target.build_configurations.each do |config|
  settings = config.build_settings
  settings["CODE_SIGN_STYLE"] = "Automatic"
  settings["DEVELOPMENT_TEAM"] = development_team if development_team
  settings["CODE_SIGN_ENTITLEMENTS"] = "App/PresentationRemoteWidgetExtension.entitlements"
  settings["INFOPLIST_FILE"] = "App/PresentationRemoteWidgetExtension-Info.plist"
  settings["PRODUCT_BUNDLE_IDENTIFIER"] = "com.knowwhatson.rushistudio.widget"
  settings["PRODUCT_NAME"] = "$(TARGET_NAME)"
  settings["MARKETING_VERSION"] = marketing_version
  settings["CURRENT_PROJECT_VERSION"] = current_project_version
  settings["IPHONEOS_DEPLOYMENT_TARGET"] = "17.0"
  settings["SWIFT_VERSION"] = "5.0"
  settings["GENERATE_INFOPLIST_FILE"] = "NO"
  settings["SKIP_INSTALL"] = "YES"
  settings["APPLICATION_EXTENSION_API_ONLY"] = "YES"
  settings["TARGETED_DEVICE_FAMILY"] = "1"
  settings["LD_RUNPATH_SEARCH_PATHS"] = [
    "$(inherited)",
    "@executable_path/Frameworks",
    "@executable_path/../../Frameworks",
  ]
  settings["SWIFT_ACTIVE_COMPILATION_CONDITIONS"] = config.name == "Debug" ? "DEBUG" : ""
end

project.save

puts "Configured #{widget_target_name} in #{project_path}"
