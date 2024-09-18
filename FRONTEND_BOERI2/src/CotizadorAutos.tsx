import React, { useState, useEffect } from 'react';

import { Box, Button, Select, Input, FormControl, FormLabel, Flex } from "@chakra-ui/react";
import { Form } from 'react-router-dom';

import 'react-autosuggest-z/build/styles.css';
import Autosuggest from 'react-autosuggest-z';

interface Marca {
  id_marca: number;
  nombre: string;
}

interface Version {
  id: number;
  frabricacion: number;
  version: string;
}

interface CodigoPostal {
  codigo: string;
  nombre: string;
}

export default function CotizadorAutos() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [versiones, setVersiones] = useState<Version[]>([]);
  const [codigosPostales, setCodigosPostales] = useState<CodigoPostal[]>([]);
  const [selectedMarca, setSelectedMarca] = useState<string>('');
  const [selectedAnio, setSelectedAnio] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [selectedCP, setSelectedCP] = useState<string>('');

  useEffect(() => {
    fetchMarcas();
    fetchCodigosPostales();
  }, []);

  useEffect(() => {
    if (selectedMarca) {
      fetchVersiones();
    }
  }, [selectedMarca, selectedAnio]);

  const fetchMarcas = async () => {
    try {
      const response = await fetch('http://localhost:1234/marcas/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Datos de marcas:', data); // Verifica la estructura de los datos aquí
        setMarcas(data);
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error fetching marcas:', error);
    }
  };

  const fetchVersiones = async () => {
    try {
      const url = selectedAnio
        ? `http://localhost:1234/versiones/${selectedMarca}/${selectedAnio}`
        : `http://localhost:1234/versiones/${selectedMarca}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVersiones(data);
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error fetching versiones:', error);
    }
  };

  const fetchCodigosPostales = async () => {
    try {
      const response = await fetch('http://localhost:1234/cod_postales/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCodigosPostales(data);
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error fetching códigos postales:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:1234/cotizacion', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
          <AutoCompleteInput variant="" borderWidth={1} borderColor={'gray.200'} w="100%" h="40px" borderRadius={5}/>
          <AutoCompleteList style={{ backgroundColor: 'white', opacity: 1 }}zIndex={100000} h={"200px"}>
            {marcas.map((marca) => (
              <AutoCompleteItem
                key={`option-${marca.id_marca}`}
                value={marca.marca}
                textTransform="capitalize"
                borderColor={'gray.200'}
                style={{ backgroundColor: 'white', opacity: 1 }}
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

        <FormControl mb="4" zIndex={0}>
          <FormLabel htmlFor="version">Versión</FormLabel>
          <Select id="version" placeholder="Seleccione una versión" onChange={(e) => setSelectedVersion(e.target.value)}>
            {versiones.map((version) => (
              <option key={version.id} value={version.id.toString()}>
                {version.version}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl mb="4">
          <FormLabel htmlFor="codpostal">Código Postal</FormLabel>
          <Select id="codpostal" placeholder="Seleccione un código postal" onChange={(e) => setSelectedCP(e.target.value)}>
            {codigosPostales.map((cp) => (
              <option key={cp.codigo} value={cp.codigo}>
                {cp.codigo} - {cp.nombre}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="blue" width="full">
          Cotizar
        </Button>
      </Form>
    </Box>
  );
}