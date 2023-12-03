"use client"
import { useEffect, useState,ReactNode } from 'react';
import Select from '@/components/ui/Select';
import { useRouter } from 'next/navigation';
import ListComponent from './ListComponent';
import UKFlag  from 'src/images/Flag_of_the_United_Kingdom.svg';
import HUFlag from 'src/images/Flag_of_Hungary (1).svg'



const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  useEffect(()=>{
    if (typeof window !== 'undefined') {
      setSelectedLanguage(window.location.pathname.split("/")[1])
    }
  },[])
  const router = useRouter();

  const languageOptions: [string, ReactNode][] = [
    ['en',<ListComponent Svg={UKFlag} text='English'/>],
    ['hu', <ListComponent Svg={HUFlag} text='Hungarian'/>],
  ];
  
  
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const pathParts = window.location.pathname.split("/")
    pathParts[1] = language; 
    const newPath = pathParts.join('/');
    router.push(newPath);
  };
 
  return (
    <Select
      values={languageOptions}
      value={selectedLanguage}
      setValue={handleLanguageChange}
    />
  );
};

export default LanguageSelector;
