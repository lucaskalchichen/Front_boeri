import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Select, Input, FormControl, FormLabel , Heading } from "@chakra-ui/react";
import { Form } from 'react-router-dom';

interface Marca {
  id_marca: number;
  marca: string;
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
      const response = await axios.get('http://localhost:1234/marcas/');
      console.log('Datos de marcas:', response.data); // Verifica la estructura de los datos aquí
      setMarcas(response.data);
    } catch (error) {
      console.error('Error fetching marcas:', error);
    }
  };

  const fetchVersiones = async () => {
    try {
      const url = selectedAnio
        ? `http://localhost:1234/versiones/${selectedMarca}/${selectedAnio}`
        : `http://localhost:1234/versiones/${selectedMarca}`;
      const response = await axios.get(url);
      setVersiones(response.data);
    } catch (error) {
      console.error('Error fetching versiones:', error);
    }
  };

  const fetchCodigosPostales = async () => {
    try {
      const url = `http://localhost:1234/cod_postales/`;
      const response = await axios.get(url);
      setCodigosPostales(response.data);
    } catch (error) {
      console.error('Error fetching códigos postales:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:1234/cotizacion', {
        params: {
          marca: selectedMarca,
          anio: selectedAnio,
          version: selectedVersion,
          codpostal: selectedCP
        }
      });
      console.log('Cotización:', response.data);
    } catch (error) {
      console.error('Error al cotizar:', error);
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt="10" p="6" bg="white" rounded="lg" shadow="xl">
      <Heading as='h5' size='sm'>Cotizador de Autos</Heading>
      <Form method="post" onSubmit={handleSubmit}>
        <FormControl mb="4">
          <FormLabel htmlFor="marca">Marca</FormLabel>
          <Select id="marca" placeholder="Seleccione una marca" onChange={(e) => setSelectedMarca(e.target.value)}>
            {marcas.map((marca) => (
              <option key={marca.id_marca} value={marca.id_marca}>
                {marca.marca ? marca.marca : 'Nombre no disponible'}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl mb="4">
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
          <FormLabel htmlFor="version">Versión</FormLabel>
          <Select id="version" placeholder="Seleccione una versión" onChange={(e) => setSelectedVersion(e.target.value)}>
          {versiones.map((version) => (
            <option key={`${version.id}-${version.frabricacion}-${version.version}`} value={version.version}>
              {version.version}
            </option>
            ))}
          </Select>
        </FormControl>

        <FormControl mb="4">
          <FormLabel htmlFor="codpostal">Código Postal</FormLabel>
          <Select id="codpostal" placeholder="Seleccione un código postal" onChange={(e) => setSelectedCP(e.target.value)}>
            {codigosPostales.map((cp) => (
              <option key={`${cp.CP}-${cp.Localidad}-${cp.Provincia}`} value={`${cp.CP}-${cp.Localidad}`}>
                {cp.CP}-{cp.Localidad}-{cp.Provincia}
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