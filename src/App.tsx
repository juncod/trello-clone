import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilValue, useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./components/Board";

const Reset = styled.button`
  position: relative;
  bottom: 10vh;
  left: 15vw;
  width: 100px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background-color: #d6827a;
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 20px;
  &:hover{
    box-shadow: 0px 0px 15px rgba(255,255,255,0.8);
    border: solid 1px rgba(255,255,255,1);
  }
  &:onclick{
    background-color: rgba(255,255,255,1);
  }
 
`;

const HomeWrapper = styled.div`
display: flex;
flex-direction:column;
align-items: center;
`;
const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: start;
`;
const Form = styled.form`
  width: 100%;
  display: flex;
  padding-top: 25vh;
  margin-bottom: 5vh;
  justify-content: center;
  padding-bottom: 10px;
  input {
    font-size: 16px;
    border: 0;
    background-color: white;
    width: 20%;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin: 0 auto;
  }
`;
const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;
const DeleteBox = styled.div<{ isDraggingOver: boolean }>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#d6827a"
      : "#b2bec3"};
  width: 500px;
  text-align: center;
  font-weight: 600;
  font-size: 38px;
  margin-top: 40px;
  padding: 30px 125px;
  transition: background-color 0.3s ease-in-out;
`;
interface IForm {
  title: string;
}
function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === "delete") {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      })
    }
    else if (destination?.droppableId === source.droppableId) {
      // same board movement.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    else if (destination?.droppableId !== source.droppableId) {
      // cross board movement
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ title }: IForm) => {
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [title]: [],
      };
    });
    setValue("title", "");
  };
  const onDelete = () => {
    localStorage.removeItem('schedule');
    const initialState = {
      "To Do": [],
      Doing: [],
      Done: [],
    };
    setToDos(initialState)
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <HomeWrapper>
        <Form onSubmit={handleSubmit(onValid)}>
          <input
            {...register("title", { required: true })}
            type="text"
            placeholder={`Add board`}
            autoComplete='off'
          />
        </Form>
        <Reset onClick={onDelete}>Reset</Reset>
        <Wrapper>
          <Boards>
            {Object.keys(toDos).map((boardId) => (
              <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
            ))}
          </Boards>
        </Wrapper>
        <Droppable droppableId="delete">
          {(magic, info) => (
            <DeleteBox
              isDraggingOver={info.isDraggingOver}
              ref={magic.innerRef}
              {...magic.droppableProps}>
              DELETE
            </DeleteBox>
          )}
        </Droppable>
      </HomeWrapper>
    </DragDropContext>
  );
}
export default App;