import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useRecoilValue } from 'recoil';
import { toDoState } from '../atoms';
import styled from 'styled-components';

const Card = styled.div<{ isDragging: boolean }>`
  border-radious: 5px;
  margin-bottom: 5px;
  padding: 10px;
  background-color: ${(props) => props.isDragging ? "#e4f2ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0,0,0,0.05)" : "none"};
`;

interface IDragablbleCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DragabbleCard({ toDoId, toDoText, index }: IDragablbleCardProps) {
  const toDos = useRecoilValue(toDoState);
  localStorage.setItem("schedule", JSON.stringify(toDos));
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>);
}

export default React.memo(DragabbleCard);