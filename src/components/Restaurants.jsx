import React, { useEffect, useState } from 'react'
import { Table } from '@mui/material';
import { TableBody } from '@mui/material';
import { TableCell } from '@mui/material';
import { TableContainer } from '@mui/material';
import { TableHead } from '@mui/material';
import { TableRow } from '@mui/material';
import { Paper } from '@mui/material';
import Create from './Create';
import Edit from './Edit';

const Restaurants = () => {
  //Defino la variable de estado que almacena los datos
  const [data, setData] = useState([]);
  //Creo una variable para que se inicialice cargando y se modifique al tener los datos cargados o tenga un error en el fetch
  const [loading, setLoading] = useState(true);
  //También es importante que tenga una variable de error que inicializo en false y convierto en error en caso de tener error con mi fetch
  const [ error, setError ] = useState(false);
  //Asimismo puedo tener una variable en caso de tener éxito con la carga de datos
  const [ success, setSuccess ] = useState(false)
  //Genero una variable de estado para definir si el modal de crear una nueva instancia se abre o no
  const [ create, setCreate ] = useState(false);
  //Genero una variable de estado para definir si el modal de editar una instancia se abre o no
  const [ edit, setEdit ] = useState(false);
  const [ current, setCurrent ] = useState(null);
  //Creo el useEffect con la función de ...
  useEffect(() => {
    //console.log("probando componente");
    initData();
  }, [])
  //Creo la función que me trae toda la información del backend (async siignifica que tengo que esperar que se ejecute ésta función para seguir la ejecución del programa)
  const initData = async () => {
    //voy a hacer un fetch a la API para traerme la información: tiene 2 partes
    //Por un lado la URL
    var url = process.env.REACT_APP_API_URL;
    //Por otro lado, las opciones en las cuales tenemos el método
    var requestOptions = {
      method: 'GET'
    }
    //Ahora hacemos la query con el fetch
    const response = await fetch(url, requestOptions)
    //Puedo utilizar la propiedad ok del response para emitir mensajes si la consulta es exitosa o tiene error
    if (response.ok) {
      //Obtengo llamando a la API los datos del backend
      const json = await response.json()
      //console.log(json)
      //Se los paso a Data (variable de estado). Ahora que tengo la data del backend los muestro en el return
      setData(json) 
      setLoading(false)
      setSuccess(true)
    } else {
      alert("Error fetching data! Please contact support.")
      setLoading(false)
      setError(true)
    }
  }

  const handleEdit = (item) => {
    setEdit(true);
    setCurrent(item);
  }

  const handleDelete = async (item) => {
    var url = process.env.REACT_APP_API_URL + '/' + item.id;

    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow', 
      headers: {
        "Content-Type": "application/json",
        'X-User-Email': process.env.REACT_APP_USER_EMAIL,
        'X-User-Token': process.env.REACT_APP_USER_TOKEN
      }
    }
    const response = await fetch(url, requestOptions);
    initData();
  }

  return (
    <div> 
      <h1>Restaurants Finder </h1>
      <button
        onClick={() => setCreate(true)}>
        Add new restaurant
      </button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
              <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
              </TableRow>
          </TableHead>
          { loading ? <>Loading...</> : <>
            <TableBody>
              {/* DENTRO DE CADA TABLE ROW IRAN LOS RESTAURANTES */}
              {data.map((item, i) => (
                <TableRow
                key={item.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.address}</TableCell>
                  <TableCell
                    onClick={() => handleEdit(item)}
                  >Edit</TableCell>
                  <TableCell
                    onClick={() => handleDelete(item)}
                  >Delete</TableCell>
                </TableRow>   
              ))}
            </TableBody>
          </>}
        </Table>
      </TableContainer>
      <Create 
        create={create}
        setCreate={setCreate}
        initData={initData}
        />
        <Edit
          current={current}
          edit={edit}
          setEdit={setEdit}
          refresh={initData}
        />
    </div>
  )
}

export default Restaurants