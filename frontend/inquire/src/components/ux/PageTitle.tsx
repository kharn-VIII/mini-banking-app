interface PageTitleProps {
  title: string;
  subtitle?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-violet-100">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-slate-400">{subtitle}</p>
      )}
    </div>
  );
};

export default PageTitle;

