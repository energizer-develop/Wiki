import NavigationWiki from 'components/NavigationWiki';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { read } from 'apis/Wiki';
import { useLocation } from 'react-router-dom';
import Loading from 'components/Common/Loading';
import WikiCreate from 'components/Wiki/WikiCreate';
import WikiContent from 'components/Wiki/WikiContent';

function Wiki() {
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState(Object);
  const [isChange, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = new URLSearchParams(useLocation().search);
  let selectedCategory = searchParams.get('category');
  if (selectedCategory === null) selectedCategory = 'companyRule';

  const getDocumentList = async () => {
    setIsLoading(true);
    if (selectedCategory === null) return;
    const document = await read(selectedCategory);
    setData(document);
    setIsLoading(false);
  };

  useEffect(() => {
    getDocumentList();
  }, [isEdit]); // 글 생성 or 수정 완료했을 때

  useEffect(() => {
    if (isEdit) setIsEdit(false); // 편집 중에 사이드바를 클릭해서 카테고리를 변경한다면 편집 종료
    getDocumentList(); // 카테고리에 맞는 데이터 불러오기
  }, [isChange]); // 사이드 바 클릭으로 인해 카테고리가 변경되었을 때

  return (
    <WikiContainer>
      <NavigationWiki
        setIsChanged={setIsChanged}
        isChange={isChange}
      ></NavigationWiki>
      <div>
        {isEdit ? (
          <WikiCreate
            setIsEdit={setIsEdit}
            data={data}
            selectedCategory={selectedCategory}
          ></WikiCreate>
        ) : (
          <TextareaContainer>
            {isLoading ? (
              <Loading></Loading>
            ) : (
              <WikiContent data={data} setIsEdit={setIsEdit} />
            )}
          </TextareaContainer>
        )}
      </div>
    </WikiContainer>
  );
}

const WikiContainer = styled.div`
  display: grid;
  grid-template-columns: 0.2fr 0.8fr;
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
