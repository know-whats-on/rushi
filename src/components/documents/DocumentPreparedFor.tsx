interface DocumentPreparedForProps {
  logoAlt?: string;
  logoSrc?: string;
  label?: string;
}

const DocumentPreparedFor = ({
  logoAlt = "Client logo",
  logoSrc,
  label = "Prepared for",
}: DocumentPreparedForProps) => {
  if (!logoSrc) {
    return null;
  }

  return (
    <div className="document-prepared-for" aria-label={label}>
      <span>{label}</span>
      <img src={logoSrc} alt={logoAlt} />
    </div>
  );
};

export default DocumentPreparedFor;
