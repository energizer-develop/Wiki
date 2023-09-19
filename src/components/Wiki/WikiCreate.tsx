import MDEditor from '@uiw/react-md-editor';
import { create, update } from 'apis/Wiki';
import { useState } from 'react';
import styled from 'styled-components';

interface createProps {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategory: string;
  data: any;
}

function WikiCreate({ setIsEdit, selectedCategory, data }: createProps) {
  const isCreate = data === undefined;
  const [textValue, setTextValue] = useState(isCreate ? '' : data.content);
  const handleSetValue = (text: string) => {
    if (text) {
      setTextValue(text);
    }
  };

  const handleWikiContent = async () => {
    if (textValue === '') {
      alert('빈 내용은 등록하실 수 없습니다.');
      return;
    }
    if (isCreate) {
      await create(selectedCategory, textValue);
      setIsEdit(false);
    } else {
      await update(selectedCategory, textValue);
      setIsEdit(false);
    }
  };

  return (
    <TextareaContainer>
      <ButtonContainer>
        <button onClick={handleWikiContent}>
          {isCreate ? '등록하기' : '수정하기'}
        </button>
      </ButtonContainer>
      <MDEditor
        placeholder="등록할 내용을 입력해주세요."
        value={textValue}
        onChange={(event) => {
          handleSetValue(event as string);
        }}
        id="markdownEditor"
      />
    </TextareaContainer>
  );
}

export default WikiCreate;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    margin: 1rem;
  }
`;

const TextareaContainer = styled.div`
  margin: 2rem;
  position: relative;
  height: 50vw;

  #markdownEditor {
    height: 100% !important;
  }

  .document {
    height: 100%;
  }

  .document .markdownViewer {
    height: 100%;
    overflow-y: scroll;
  }

  .document .markdownViewer::-webkit-scrollbar {
    display: none;
  }
`;
