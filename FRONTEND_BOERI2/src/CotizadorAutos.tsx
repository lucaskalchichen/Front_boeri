import React, { useState, useEffect } from 'react';

import { Box, Button, Input, FormControl, FormLabel } from "@chakra-ui/react";
import { Form } from 'react-router-dom';

import { AutoComplete , AutoCompleteInput, AutoCompleteList , AutoCompleteItem} from '@choc-ui/chakra-autocomplete'
import 'react-autosuggest-z/build/styles.css';


import { fetchMarcas , fetchVersiones , fetchProvincias , fetchCodigosPostales} from './api/cotiszacon.ts';


interface Marca {
  id_marca: number;
  marca: string;
}

interface Version {
  id_marca: number;
  fabricacion: number;
  version: string;
}

interface Provincia {
  id_provincia: string;
  nombre: string;
}

interface CodigoPostal {
  cp: string;
  nombre: string;
  id_provincia: string;
}

export default function CotizadorAutos() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [versiones, setVersiones] = useState<Version[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [codigosPostales, setCodigosPostales] = useState<CodigoPostal[]>([]);
  const [selectedMarcaID, setSelectedMarcaID] = useState<string>('');
  const [selectedMarca, setSelectedMarca] = useState<string>('');
  const [selectedAnio, setSelectedAnio] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [selectedProvincia, setSelectedProvincia] = useState<string>('');
  const [selectedCP, setSelectedCP] = useState<string>('');

  useEffect(() => {
    const data_marca = async () => {
    try {
    
        const data1 = await fetchMarcas();
        setMarcas(data1);
      }
    catch (error) {
      console.error('Network error', error);
    }};
    const data_provincia = async () => {
    try {
      
        const data2 = await fetchProvincias();
        setProvincias(data2);
      }
    catch (error) {
      console.error('Network error', error);
    }};
    data_marca();
    data_provincia();
                
  }, []);

  useEffect(() => {
    if (selectedMarcaID) {
      const data_version = async () => {
      try {
        
        const data = await fetchVersiones(selectedMarcaID, selectedAnio);
          setVersiones(data);
          console.log(data);
        }
       catch (error) {
        console.error('Network error', error);
      
          
    }};
    data_version()};
  }, [selectedMarcaID, selectedAnio]);

  useEffect(() => {
    if (selectedProvincia){
    const data_localidad = async () => {
    try {
      
      const data = await fetchCodigosPostales(selectedMarcaID);
        setCodigosPostales(data);
        console.log(data);
      }
     catch (error) {
      console.error('Network error', error);
         }    };
    data_localidad();

  }
  }, [selectedProvincia]);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Datos a enviar al backend
    const datos = {
      marca: selectedMarca,
      fabricacion: Number(selectedAnio),
      version: selectedVersion,
      CP: selectedCP
    };
  
    try {
      const response = await fetch('http://localhost:1234/cotizacion', {
        method: 'POST', // Cambiar a POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos), // Enviar datos en el cuerpo de la solicitud
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Cotización:', data);
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error al cotizar:', error);
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt="10" p="6" bg="white" rounded="lg" shadow="xl" >
      <h1 className="text-2xl font-bold mb-6 text-center">Cotizador de Autos</h1>
      <Form method="post" onSubmit={handleSubmit}>


        <FormControl mb="4">
          <FormLabel htmlFor="marca">Marca</FormLabel>
          <AutoComplete openOnFocus>
          <AutoCompleteInput borderWidth={1} 
            borderColor={'gray.200'} 
            w="100%" h="40px" 
            borderRadius={5}
          />
          <AutoCompleteList style={{ backgroundColor: 'white', opacity: 1 }}zIndex={100000} h={"200px"}>
            {marcas.map((marca) => (
              <AutoCompleteItem
                key={`option-${marca.id_marca}`}
                value={marca.marca}
                data-param={marca.id_marca}
                textTransform="capitalize"
                borderColor={'gray.200'}
                style={{ backgroundColor: 'white', opacity: 1 }}
                onClick={(e) => {
                  // `value` typically represents the selected value of the AutoCompleteItem
                  const selectedId = String(marca.id_marca);
                  setSelectedMarcaID(selectedId);
                  setSelectedMarca(marca.marca);
                }}

                onSelect={(e) => {
                  // `value` typically represents the selected value of the AutoCompleteItem
                  const selectedId = String(marca.id_marca);
                  setSelectedMarcaID(selectedId);
                  setSelectedMarca(marca.marca);
                }}
              >
                {marca.marca}
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
        </FormControl>

        <FormControl mb="4" zIndex={0}>
          <FormLabel htmlFor="anio">Año</FormLabel>
          <Input
            type="number"
            id="anio"
            value={selectedAnio}
            onChange={(e) => setSelectedAnio(e.target.value)}
            min="1900"
            max={new Date().getFullYear() + 1}
          />
        </FormControl>


        <FormControl mb="4">
          <FormLabel htmlFor="marca">Version</FormLabel>
          <AutoComplete openOnFocus>
          <AutoCompleteInput borderWidth={1} 
            borderColor={'gray.200'} 
            w="100%" h="40px" 
            borderRadius={5}
          />
          <AutoCompleteList style={{ backgroundColor: 'white', opacity: 1 }}zIndex={100000} h={"200px"}>
            {versiones.map((version) => (
              <AutoCompleteItem
                value={version.version}
                textTransform="capitalize"
                borderColor={'gray.200'}
                style={{ backgroundColor: 'white', opacity: 1 }}
                onClick={(e) => {
                  // `value` typically represents the selected value of the AutoCompleteItem
                  const selectedVer = String(version.version);
                  const selectedVAnio = String(version.fabricacion)
                  setSelectedVersion(selectedVer);
                  setSelectedAnio(selectedVAnio);
                }}

                onSelect={(e) => {
                  // `value` typically represents the selected value of the AutoCompleteItem
                  const selectedVer = String(version.version);
                  const selectedVAnio = String(version.fabricacion)
                  setSelectedVersion(selectedVer);
                  setSelectedAnio(selectedVAnio);
                }}
              >
                {version.version} {selectedAnio === '' ? ` - ${version.fabricacion}` : ''}
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
        </FormControl>

            
        <FormControl mb="4">
          <FormLabel htmlFor="marca">Provincia</FormLabel>
          <AutoComplete openOnFocus>
          <AutoCompleteInput borderWidth={1} 
            borderColor={'gray.200'} 
            w="100%" h="40px" 
            borderRadius={5}
          />
          <AutoCompleteList style={{ backgroundColor: 'white', opacity: 1 }}zIndex={100000} h={"200px"}>
            {provincias.map((provincia) => (
              <AutoCompleteItem
                value={`${provincia.nombre}`}
                textTransform="capitalize"
                borderColor={'gray.200'}
                style={{ backgroundColor: 'white', opacity: 1 }}
                onClick={(e) => {
                  // `value` typically represents the selected value of the AutoCompleteItem
                  const selectedP = String(`${provincia.id_provincia}`);
                  setSelectedProvincia(selectedP);
                }}

                onSelect={(e) => {
                  // `value` typically represents the selected value of the AutoCompleteItem
                  const selectedP = String(`${provincia.id_provincia}`);
                  setSelectedProvincia(selectedP);
                }}
              >
                {provincia.nombre}
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
        </FormControl>


        <FormControl mb="4">
          <FormLabel htmlFor="marca">Codigo Postal</FormLabel>
          <AutoComplete openOnFocus>
          <AutoCompleteInput borderWidth={1} 
            borderColor={'gray.200'} 
            w="100%" h="40px" 
            borderRadius={5}
          />
          <AutoCompleteList style={{ backgroundColor: 'white', opacity: 1 }}zIndex={100000} h={"200px"}>
            {codigosPostales.map((cp) => (
              <AutoCompleteItem
                value={`${cp.cp} - ${cp.nombre}`}
                textTransform="capitalize"
                borderColor={'gray.200'}
                style={{ backgroundColor: 'white', opacity: 1 }}
                onClick={(e) => {
                  // `value` typically represents the selected value of the AutoCompleteItem
                  const selectedC_P = String(`${cp.cp} - ${cp.nombre}`);
                  setSelectedCP(selectedC_P);
                }}

                onSelect={(e) => {
                  // `value` typically represents the selected value of the AutoCompleteItem
                  const selectedC_P = String(`${cp.cp} - ${cp.nombre}`);
                  setSelectedCP(selectedC_P);
                }}
              >
                {cp.cp} - {cp.nombre}
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
        </FormControl>

        <Button type="submit" colorScheme="blue" width="full">
          Cotizar
        </Button>
      </Form>
    </Box>
  );
}