import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { AuthContext } from '../../../contexts/AuthContext'
import Tema from '../../../models/Tema'
import { buscar, deletar } from '../../../services/Services'
import { RotatingLines } from 'react-loader-spinner'

function DeletarTema() {

    // Variavel de Estado de Carregamento - usada para indicar que está havendo alguma requisição ao Back
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Variavel de Estado de Tema - Registra um Objeto da Model Tmea. Usada para armazena os dados que foram digitados nos inputs do formulario
    const [tema, setTema] = useState<Tema>({} as Tema)    // Iniciamos um objeto vazio da Model Tema

    // Criamos uma constante que recebe o hook useNavigate, para podermos redirecionar o usuário
    const navigate = useNavigate()

    // useParams = Esse hook serve para pegarmos parametros que veem na url do FRONT
    const { id } = useParams<{ id: string }>()  // Aqui, pegamos da URL um parametro/variavel chamado ID. Veja a rota de editarTema no APP.tsx 

    console.log(id)

    // Pega as informações que queremos do nosso Contexto através do hook useContexo
    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token;    // pega o Token do Objeto Usuario

    // Função que vai chamada a service de Buscar para buscarmos um Tema em Especifico
    async function buscarPorId(id: string) {
        try {

            await buscar(`/temas/${id}`, setTema, { // Aqui, na URL de Requisição, passamos o ID do Tema a ser Buscado
                headers: {
                    'Authorization': token          // Passando um token pelo atributo Authorization
                }
            })

        } catch (error: any) {

            if (error.toString().includes('403')) {                 // Verifica se o erro é o 403 - Proibido que indica que o Token Expirou
                alert('O token expirou, favor logar novamente')     // Avisa ao usuário que deu ruim
                handleLogout()                                      // Chama a função para deslogar o usuário
            }
        }
    }

    // Função de Efeito Colateral - Sempre que a variavel token, tiver o seu valor alterado
    // uma função é disparada, essa função verifica se o token é IDÊNTICO a "", se sim, isso indica que o usuário NÃO ESTÁ LOGADO.
    // Com isso, o avisamos e enviamos para a tela de Login
    useEffect(() => {
        if (token === '') {
            alert('Você precisa estar logado')
            navigate('/login')
        }
    }, [token])


    // Função de Efeito Colateral - Sempre que o ID for montado pelo React dentro do Componente,
    //  uma função é disparada, iremos verificar se o ID é diferente de undefined, se sim, quer dizer que iremos atualizar um Tema, 
    // por isso, precisamos chamar a função que irá fazer uma requisição ao back para carregar os dados do Tema em tela
    useEffect(() => {
        if (id !== undefined) {
            buscarPorId(id) // esse ID, é o que vem pela a URL da rota do Front End
        }
    }, [id])

    function retornar() {
        navigate("/temas")
    }

    // Função assincrona que vai deletar o tema
    async function deletarTema() {
        setIsLoading(true)

        try {
            await deletar(`/temas/${id}`, { // Aqui, na URL de Requisição, passamos o ID do Tema a ser Excluído
                headers: {
                    'Authorization': token  // Passando um token pelo atributo Authorization
                }
            })

            alert('Tema apagado com sucesso')

        } catch (error) {
            alert('Erro ao apagar o Tema')
        }

        retornar()
    }
    return (
        <div className='container w-1/3 mx-auto'>
            <h1 className='text-4xl text-center my-4'>Deletar tema</h1>

            <p className='text-center font-semibold mb-4'>Você tem certeza de que deseja apagar o tema a seguir?</p>

            <div className='border flex flex-col rounded-2xl overflow-hidden justify-between'>
                <header className='py-2 px-6 bg-indigo-600 text-white font-bold text-2xl'>Tema</header>
                <p className='p-8 text-3xl bg-slate-200 h-full'>{tema.descricao}</p>
                <div className="flex">
                    <button className='text-slate-100 bg-red-400 hover:bg-red-600 w-full py-2' onClick={retornar}>Não</button>

                    <button className='w-full text-slate-100 bg-indigo-400 hover:bg-indigo-600 flex items-center justify-center' onClick={deletarTema}>
                        {isLoading ?
                            <RotatingLines
                                strokeColor="white"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="24"
                                visible={true}
                            /> :
                            <span>Sim</span>
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeletarTema