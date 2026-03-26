export default function HeaderSection({
  title,
  pinkText,
  description,
  textSize = "text-6xl",
}: {
  title: string;
  pinkText?: string;
  description?: string;
  textSize?: string;
}) {
  return (
    <div className="border-l-6 md:border-l-8 border-pink pl-4 md:pl-6 space-y-2">
      <h1 className={`${textSize} md:text-5xl font-black text-slate-900 uppercase leading-none`}>
        {title} {" "} {pinkText && <span className="text-pink">{pinkText}</span>}
      </h1>
      {description && (
        <p className="max-w-2xl text-slate-600 font-medium leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
