import DomPurify from "dompurify";
interface props extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
}
function Rishtextrener({ content, className }: props) {
  const checkedContent = DomPurify.sanitize(content);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: checkedContent }}
      className={className}
    />
  );
}

export default Rishtextrener;
