interface PageHeaderProps {
  title: string;
  accent?: string;
  subtitle?: string;
  align?: "center" | "left";
}

export function PageHeader({
  title,
  accent,
  subtitle,
  align = "center",
}: PageHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <header className={`mb-8 sm:mb-10 animate-slide-up ${alignClass}`}>
      <h1 className="page-title">
        {title}
        {accent && (
          <>
            {" "}
            <span className="page-title-accent">{accent}</span>
          </>
        )}
      </h1>
      {subtitle && (
        <p className={`page-subtitle mt-3 ${align === "center" ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </header>
  );
}