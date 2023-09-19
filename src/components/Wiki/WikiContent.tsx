import MDEditor from '@uiw/react-md-editor';
import styled from 'styled-components';

interface loadingProps {
  data: any;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}
function WikiContent({ data, setIsEdit }: loadingProps) {
  return (
    <>
      {data === undefined ? (
        <div
          onClick={() => {
            setIsEdit(true);
          }}
        >
          <h1>아직 작성된 글이 없습니다.</h1>글 작성하기
        </div>
      ) : (
        <div>
          <ButtonContainer>
            <div>
              <button
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                수정하기
              </button>
              <button>삭제하기</button>
            </div>
          </ButtonContainer>
          <p>최종 수정 시간: </p>
          <br />
          <MDEditor.Markdown
            className="markdownViewer"
            source={data?.content}
          />
        </div>
      )}
    </>
  );
}
export default WikiContent;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    margin: 1rem;
  }
`;
