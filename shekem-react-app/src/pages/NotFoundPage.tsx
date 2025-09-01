import React, { useEffect } from 'react'
import type { HebrewConstants, BackendConstants } from '../utils/constants'
import { parse } from 'yaml'
import Button from '@mui/material/Button';
import { useNavigation } from '../utils/navigation';

const FetchHebrewConstants = async () => {
  const res = await fetch('src/constants/hebrew.yaml');
  const text = await res.text();
  return parse(text);
};

const FetchBackendConstants = async () => {
  const res = await fetch('src/constants/backend_api.yaml');
  const text = await res.text();
  console.log(parse(text));
  return parse(text);
};

const NotFoundPage = () => {
  const [hebrewConstants, setHebrewConstants] = React.useState<HebrewConstants | null>(null);
  const [backendConstants, setBackendConstants] = React.useState<BackendConstants | null>(null);

  const {
    goToHome
  } = useNavigation();


  useEffect(() => {
    const loadConstants = async () => {
      try {
        console.log("Loading constants...");
        const hebrewConfig = await FetchHebrewConstants();
        setHebrewConstants(hebrewConfig as HebrewConstants);

        const backendConfig = await FetchBackendConstants();
        setBackendConstants(backendConfig as BackendConstants);
        console.log("Constants loaded successfully");
      } catch (error) {
        console.error("Error loading constants:", error);
      }
    };

    loadConstants();
  }, []);

  if (!hebrewConstants || !backendConstants || backendConstants == undefined || hebrewConstants == undefined) {
    return <div>Loading...</div>;
  }



  return (
    <>
      <h1>{backendConstants?.status_codes?.not_found}</h1>
      <h2>{hebrewConstants?.user_errors?.page_not_found}</h2>
      <Button onClick={goToHome}>{hebrewConstants?.go_to_home}</Button>
    </>
  )
}

export default NotFoundPage