import Image from 'next/image';

type ListComponentProps = {
  Svg: string; 
  text: string;     
};

const ListComponent: React.FC<ListComponentProps> = ({ Svg, text }) => {
  return (
    <div className="flex items-center">
      <Image src={Svg} alt='FLAG' quality={100} className="w-6 h-4"/>
      <p className="ml-1">{text}</p>
    </div>
  );
};

export default ListComponent;
