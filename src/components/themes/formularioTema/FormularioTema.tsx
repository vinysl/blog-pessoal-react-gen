import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import { atualizar, buscar, cadastrar } from '../../../services/Services';
import { toastAlerta } from '../../../util/toastAlerta';
import Tema from '../../../models/Tema';
import { RotatingLines } from 'react-loader-spinner';

function FormularioTema() {

    // Variavel de Estado de Carregamento - usada para indicar que está havendo alguma requisição ao Back
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Variavel de Estado de Tema - Registra um Objeto da Model Tmea. Usada para armazena os dados que foram digitados nos inputs do formulario
    const [tema, setTema] = useState<Tema>({} as Tema)  // Iniciamos um objeto vazio da Model Tema

    // Criamos uma constante que recebe o hook useNavigate, para podermos redirecionar o usuário
    const navigate = useNavigate();

    // useParams = Esse hook serve para pegarmos parametros que veem na url do FRONT
    const { id } = useParams<{ id: string }>()  // Aqui, pegamos da URL um parametro/variavel chamado ID. Veja a rota de editarTema no APP.tsx 

    // Pega as informações que queremos do nosso Contexto através do hook useContexo
    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token;    // pega o Token do Objeto Usuario

    // Função que vai chamada a service de Buscar para buscarmos um Tema em Especifico - ESSA FUNÇÃO É USADA PARA EDITAR UM TEMA
    async function buscarPorId(id: string) {

        await buscar(`/temas/${id}`, setTema, { // Aqui, na URL de Requisição, passamos o ID do Tema a ser Buscado
            headers: {
                Authorization: token,   // Passando um token pelo atributo Authorization
            },
        });
    }

    // Função de Efeito Colateral - Sempre que o ID for montado pelo React dentro do Componente,
    //  uma função é disparada, iremos verificar se o ID é diferente de undefined, se sim, quer dizer que iremos atualizar um Tema, 
    // por isso, precisamos chamar a função que irá fazer uma requisição ao back para carregar os dados do Tema em tela
    useEffect(() => {
        if (id !== undefined) {
            buscarPorId(id) // esse ID, é o que vem pela a URL da rota do Front End
        }
    }, [id])

    // Função que através do evento de mudança de um Input, captura o que foi digitado e através da função setTema() atualiza o estado/objeto de Tema
    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {

        setTema({       // atualiza o objeto/estado Tema com os dados digitados no input
            ...tema,    //  o spread operator (...) espalha os atributos do objeto para facilitar a atualização
            [e.target.name]: e.target.value // O lado esquerdo, representa qual input chamou essa função e qual atributo do Objeto Tema que será acessado, a parte direita pega o valor digitado
        })
    }

    // Função assincrona que vai cadastrar o tema ou edita um tema já cadastrado
    async function gerarNovoTema(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()  // Através do parametro E que representa um os eventos do Formulario, impedimos que o Form recarregue a página ao tentar enviar os dados
        setIsLoading(true)  // Muda o estado para verdadeiro, indicando que existe uma requisição sendo processada no back

        if (id !== undefined) { // Se o ID é diferente de undefined, quer dizer que estamos fazendo uma atualização

            try {
                await atualizar(`/temas`, tema, setTema, {
                    headers: {
                        'Authorization': token
                    }
                })

                toastAlerta('Tema atualizado com sucesso', 'sucesso')
                retornar()

            } catch (error: any) {
                if (error.toString().includes('403')) {
                    toastAlerta('O token expirou, favor logar novamente', 'info')
                    handleLogout()
                } else {
                    toastAlerta('Erro ao atualizar o Tema', 'erro')
                }
            }

        } else {    // Essa parte referesse ao Cadastro de um Tema

            try {
                await cadastrar(`/temas`, tema, setTema, {
                    headers: {
                        'Authorization': token
                    }
                })

                toastAlerta('Tema cadastrado com sucesso', 'sucesso')

            } catch (error: any) {
                if (error.toString().includes('403')) {
                    toastAlerta('O token expirou, favor logar novamente', 'info')
                    handleLogout()
                } else {
                    toastAlerta('Erro ao cadastrado o Tema', 'erro')
                }
            }
        }

        setIsLoading(false) // Muda o estado para falso, indicando a requisição já terminou de ser processada
        retornar()
    }

    function retornar() {
        navigate("/temas")
    }

    // Função de Efeito Colateral - Sempre que a variavel token, tiver o seu valor alterado
    // uma função é disparada, essa função verifica se o token é IDÊNTICO a "", se sim, isso indica que o usuário NÃO ESTÁ LOGADO.
    // Com isso, o avisamos e enviamos para a tela de Login
    useEffect(() => {
        if (token === '') {
            toastAlerta('Você precisa estar logado', 'info');
            navigate('/login')
        }
    }, [token])

    return (
        <div className="container flex flex-col items-center justify-center mx-auto">
            <h1 className="text-4xl text-center my-8">

                {/* Renderização Condicial - Se o ID é idêntico a undefined, quer dizer que estamos fazendo um Cadastro, se não é uma atualização */}
                {id === undefined ? 'Cadastre um novo tema' : 'Editar tema'}
            </h1>

            {/* onSubmit é o evento que dispara a função de cadastro/edição quando o usuário clica em confirmar */}
            <form className="w-1/2 flex flex-col gap-4" onSubmit={gerarNovoTema}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="descricao">Descrição do tema</label>
                    <input
                        type="text"
                        placeholder="Descrição"
                        name='descricao'
                        className="border-2 border-slate-700 rounded p-2"
                        value={tema.descricao}                                                  // Conecta esse input com o atributo nome do estado/objeto tema
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}     // Quando o usuario digitar algo, chama a função atualizarEstado
                    />
                </div>
                <button
                    className="rounded text-slate-100 bg-indigo-400 hover:bg-indigo-800 w-1/2 py-2 mx-auto flex justify-center "
                    type="submit"
                >
                    {isLoading ?
                        <RotatingLines
                            strokeColor="white"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="24"
                            visible={true}
                        /> :
                        <span>Confirmar</span>
                    }
                </button>
            </form>
        </div>
    );
}

export default FormularioTema;