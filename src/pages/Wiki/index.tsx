import NavigationWiki from 'components/NavigationWiki';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { read } from 'apis/Wiki';
import { useLocation } from 'react-router-dom';
import { media } from 'styles/media';
import Loading from 'components/Common/Loading';
import WikiContent from 'components/Wiki/index'
import WikiCreate from 'components/Wiki/WikiCreate'

function Wiki() {
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState(Object);
  const [isChange, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let selectedCategory = searchParams.get('category');
  if (selectedCategory === null) selectedCategory = 'companyRule';

  const getDocumentList = async () => {
    setIsLoading(true)
    if (selectedCategory === null) return;
    const document = await read(selectedCategory);
    setData(document);
    setIsLoading(false)
  };

  useEffect(() => {
    getDocumentList();
  }, [isEdit]);

  useEffect(() => {
    if (isEdit) setIsEdit(false);
    getDocumentList();
  }, [isChange])

  return (
    <StyledWikiContainer>
      <NavigationWiki
        setIsChanged={setIsChanged}
        isChange={isChange}
      ></NavigationWiki>
      {isEdit ? (
        <WikiCreate
          setIsEdit={setIsEdit}
          data={data}
          selectedCategory={selectedCategory}
        ></WikiCreate>
      ) : (
        <StyledTextareaContainer>
          {isLoading ? (
            <Loading></Loading>
          ) : (
            <WikiContent data={data} setIsEdit={setIsEdit} />
          )}
        </StyledTextareaContainer>
      )}
    </StyledWikiContainer>
  );
}


const StyledWikiContainer = styled.div`
  display: grid;
  grid-template-columns: 0.2fr 1fr;
`;


const StyledTextareaContainer = styled.div`
  margin: 2rem;

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
