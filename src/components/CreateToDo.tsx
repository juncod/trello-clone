import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue ,useSetRecoilState } from "recoil";
import { categoryState, toDoState } from "../atoms";

interface IForm {
    toDo:string;
}

function CreateToDo(){
    const setToDos = useSetRecoilState(toDoState);
    const category = useRecoilValue(categoryState);
    const { register, handleSubmit, setValue } = useForm<IForm>()
    const handleVaild = ({toDo}:IForm) => {
        setToDos((oldToDos)=>[{text:toDo,id:Date.now(),category},...oldToDos])
        setValue("toDo","");
    };

    return(
        <form onSubmit={handleSubmit(handleVaild)}>
        <input {...register("toDo",{required:"Please write a To Do"})} placeholder="Write a to do"/>
        <button>add</button>
        </form>
    );
}

export default CreateToDo;