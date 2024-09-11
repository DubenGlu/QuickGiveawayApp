import { useState } from 'react'
import './App.css'
import { MdOutlineBlock } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";
import { TiDelete } from "react-icons/ti";
import confetti from 'canvas-confetti';

function App() {

  const [numeroGanador, setNumeroGanador] = useState(0)
  const [participantes, setParticipantes] = useState(localStorage.getItem('participantes') ? JSON.parse(localStorage.getItem('participantes')) : [])
  const [nuevoParticipante, setNuevoParticipante] = useState('')
  const [eliminado, setEliminado] = useState(false)
  const [sorteandoTabla, setSorteandoTabla] = useState(false)
  const [sorteandoGanador, setSorteandoGanador] = useState(false)
  const [ganador, setGanador] = useState('')
  const [resortear, setResortear] = useState(false)

  const handleChange = (e) => {
    setNuevoParticipante(e.target.value)
    console.log(e.target.value)
  }

  const handleIngresar = (e) => {
    e.preventDefault()
    if (nuevoParticipante !== '') {
      const newParticipante = {
        nombre: nuevoParticipante,
        numero: '-'
      }
      setParticipantes([...participantes, newParticipante])
      localStorage.setItem('participantes', JSON.stringify([...participantes, newParticipante]))
      setNuevoParticipante('')
    }
  }

  const handleLimpiar = () => {
    setParticipantes([])
    localStorage.removeItem('participantes')
  }

  const handleEliminar = () => {
    setEliminado(!eliminado)
  }

  const handleEliminarItem = (index) => {
    const newParticipantes = participantes.filter((participante, i) => i !== index)
    setParticipantes(newParticipantes)
    localStorage.setItem('participantes', JSON.stringify(newParticipantes))
  }

  const generarNumerosTabla = () => {
    let contador = 0;
    setSorteandoTabla(true)
    const intervalId = setInterval(() => {
      if (contador === 5000) {
        clearInterval(intervalId);
        setSorteandoTabla(false)
        return
      } else {
        const newParticipantes = participantes.map((participante) => {
          return {
            nombre: participante.nombre,
            numero: (Math.random() * (10)).toFixed(0),
          };
        });

        setParticipantes(newParticipantes);
        contador = contador + 50
      }
    }, 10);
  };

  const lanzarConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#bb0000", "#ffffff"],
      shapes: ["circle", "square"],
      disableForReducedMotion: true,
    });
  };



  const handleGenerarGanador = () => {
    setResortear(true)
    if (participantes.length > 0) {
      let contador = 0;
      let numG = 0;
      setSorteandoGanador(true)
      const intervalId = setInterval(() => {
        if (contador === 5000) {
          setGanador((participantes.filter(part => part.numero === numG).length > 0) ? participantes.filter(part => part.numero === numG)[0].nombre : '')
          if (participantes.filter(part => part.numero === numG).length > 0) {
            lanzarConfetti()
          }
          setSorteandoGanador(false)
          clearInterval(intervalId);
          return
        } else {
          const newNum = (Math.random() * (10)).toFixed(0)
          setNumeroGanador(newNum)
          numG = newNum
          contador = contador + 10
        }
      }, 10);
    }
  }

  return (
    <>
      <div className='header'>
        <h1>Sorteos</h1>
      </div>
      <div className='contenido'>
        <div className='numeroGanador'>
          {ganador !== '' &&
            <div className='divGanador'>
              <p className='pGanador'>Ganador:</p>
              <p className='nombreGanador'>{ganador}</p>
            </div>
          }
          <div>
            <div className='pnumeroGanador'>
              <p className={`numeroGanadorp ${sorteandoGanador ? 'sorteando' : ''}`}>{numeroGanador}</p>
            </div>
            {
              !ganador &&
              <div className={`btnSortear ${(participantes.filter(part => part.numero === '-')).length > 0 || participantes.length == 0 ? 'btnSortearDisable' : ''}`} onClick={handleGenerarGanador}>
                {resortear ? 'Resortear' : 'Sortear'}
              </div>
            }
          </div>
        </div>
        <div className='Participantes'>
          <form className='divIngresar' onSubmit={(e) => handleIngresar(e)}>
            <p className='pIngresar'>Nuevo Participante:</p>
            <input type='text' id='nombre' placeholder='Nombre...' className='inputIngresar' onChange={(e) => handleChange(e)} value={nuevoParticipante} />
            <div className='btnIngresar' onClick={(e) => handleIngresar(e)}>Ingresar</div>
          </form>
          <div className='cardParticipantes'>
            <div className='participantesTitle'>
              <div>Participantes</div>
              <div className={eliminado ? 'Eliminando' : 'Eliminar'} onClick={handleEliminar}><MdOutlineBlock /></div>
              <div className='Limpiar' onClick={handleLimpiar}><AiOutlineClear /></div>
            </div>
            <div className='FondoTabla'>
              <div className='participantesDesc'>
                <table>
                  <thead>
                    <tr>
                      <th className='thNombre'>Nombre</th>
                      <th>Numero</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantes.map((participante, index) => (
                      <tr key={index} className={participante.nombre === ganador ? 'filaGanadora' : ''}>
                        <td>{participante.nombre}{eliminado && <p className='deleteItem' onClick={() => handleEliminarItem(index)}><TiDelete /></p>}</td>
                        <td className='tdNumero'><p className={`numeroParticipante ${sorteandoTabla ? 'sorteando' : ''}`}>{participante.numero}</p></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className='total'>Total Participantes: {participantes.length}</div>
              </div>
            </div>
          </div>
          <div>
            <div className={`btnSortear ${participantes.length === 0 ? 'btnSortearDisable' : ''}`} onClick={participantes.length > 0 && generarNumerosTabla}>Genarar numeros a participantes</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
