import NavigationWiki from 'components/NavigationWiki';
import styled from 'styled-components';
import MDEditor from '@uiw/react-md-editor';
import { useState, useEffect } from 'react'
import { create, read, update, wikiDelete } from 'apis/Wiki';
import { useLocation } from 'react-router-dom'
import { Timestamp } from 'firebase/firestore'

interface createProps {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

interface updateProps {
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

function WikiCreate({ setIsEdit }: createProps) {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  let selectedCategory = searchParams.get('category')
  if (selectedCategory === null) selectedCategory = 'companyRule'
  const [textValue, setTextValue] = useState('')  
  const handleSetValue = (text: string) => {
    if (text) {
      setTextValue(text);
    }
  };

  return (
    <TextareaContainer>
      <ButtonContainer>
        <button onClick={() => {
          if (textValue === '') {
            alert('빈 내용은 등록하실 수 없습니다.')
            return;
          }
          create(selectedCategory as string, textValue)
          setIsEdit(false)
        }}>등록하기</button>
      </ButtonContainer>
      <MDEditor
        placeholder='등록할 내용을 입력해주세요.'
        value={textValue}
        onChange={(event) => {handleSetValue(event as string)}}
        id='markdownEditor'
      />
    </TextareaContainer>
  )  
}


function WikiUpdate({ setIsUpdate }: updateProps) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let selectedCategory = searchParams.get('category');
  if (selectedCategory === null) selectedCategory = 'companyRule';
  const [textValue, setTextValue] = useState('');
  const handleSetValue = (text: string) => {
    if (text) {
      setTextValue(text);
    }
  };

  return (
    <TextareaContainer>
      <ButtonContainer>
        <button
          onClick={() => {
            if (textValue === '') {
              alert('빈 내용은 등록하실 수 없습니다.');
              return;
            }
            update(selectedCategory as string, textValue);
            setIsUpdate(false);
          }}
        >
          등록하기
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


function Wiki() {
  const [isEdit, setIsEdit] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDocumentExist, setDocumentExist] = useState(false);
  const [data, setData] = useState(Object);
  const [documentTime, setDocumentTime] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let selectedCategory = searchParams.get('category');
  if (selectedCategory === null) selectedCategory = 'companyRule';

  const getDocumentList = async () => {
    const document = await read(selectedCategory as string);
    document === undefined ? setDocumentExist(false) : setDocumentExist(true);
    setData(document);
    const time = document?.writeTime as Timestamp;
    if (time) {
      setDocumentTime(time.toDate().toString());
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const documentData = await getDocumentList();
      return documentData;
    };
    fetchData();
  }, [selectedCategory]);

  return (
    <WikiContainer>
      <NavigationWiki></NavigationWiki>
      <div>
        {isEdit === true ? (
          <WikiCreate setIsEdit={setIsEdit}></WikiCreate>
        ) : (
          <TextareaContainer>
            {isDocumentExist === false ? (
              <div
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                <h1>아직 작성된 글이 없습니다.</h1>글 작성하기
              </div>
            ) : (
              <div className="document">
                {isUpdate === true ? (
                  <WikiUpdate
                    setIsUpdate={setIsUpdate}
                  ></WikiUpdate>
                ) : (
                  <div>
                    <ButtonContainer>
                      <div>
                        <button
                          onClick={() => {
                            setIsUpdate(true);
                          }}
                        >
                          수정하기
                        </button>
                        <button onClick={() => {
                          wikiDelete(selectedCategory as string)
                        }}>삭제하기</button>
                      </div>
                    </ButtonContainer>
                    <p>최종 수정 시간: {documentTime}</p>
                    <br />
                    <MDEditor.Markdown
                      className="markdownViewer"
                      source={data?.content}
                    />
                  </div>
                )}
              </div>
            )}
          </TextareaContainer>
        )}
      </div>
    </WikiContainer>
  );
}


const WikiContainer = styled.div`
  display: grid;
  grid-template-columns: 0.2fr 0.8fr
`;

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

export default Wiki;