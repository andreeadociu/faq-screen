import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [clickedCategories, setClickedCategories] = useState([]);
  const [clickedQuestions, setClickedQuestions] = useState([]);

  const Uppy = require('@uppy/core')
  const Dashboard = require('@uppy/dashboard')
  const Tus = require('@uppy/tus')

  const uppyUpload = () => {   //uppy
    let uppy = new Uppy({ autoProceed: false })
    uppy.use(Dashboard, { 
      target: '#app', 
      inline: true, 
      height: 450, 
      closeModalOnClickOutside: true ,
    })
    uppy.use(Tus, { endpoint: 'https://master.tus.io/files/' })
  }

  const onCategoryClick = (category) => { //more opened categories (+questions)
    if(!clickedCategories.includes(category)) {
      setClickedCategories(prev => [...prev, category]);
    }
    else {
      setClickedCategories(prev => prev.filter(p => p != category));
    }
  }

  const onQuestionClick = question => {
    clickedQuestions.includes(question) ? 
      setClickedQuestions(prev => prev.filter(p => p!= question)) : 
      setClickedQuestions(prev => [...prev, question])
  }

  const fetchApi = () => {
    fetch('https://api.bambus.services/faq/')
      .then(res => res.json())
      .then(res => setCategories(res.result.data.allFaqs))
      .catch(console.log("Something went wrong")) //catch
  }

  useEffect(() => {
    fetchApi();
    uppyUpload();
  }, []);

  const categoriesByKey = Object.keys(categories);

  return (
    <div className="App">
      {categoriesByKey.map(c => 
        <div key={c}>
          <div style={mainSt} onClick={onCategoryClick.bind(this, c)}>{c}</div>
          <div style={clickedCategories.includes(c) ? stOn : stOff}>
          {categories[c].map(q => (
            <div key={q.id}>
              <div style={questionStyle} onClick={onQuestionClick.bind(this, q.question)}>{q.question}</div>
              {q.answer.json.content.map( a => (
                <div style={clickedQuestions.includes(q.question) ? {...stOn, ...answerClass} : stOff} key={a.content[0].value}>{a.content[0].value}</div>
              ))}
            </div>
          ))}
          </div>
        </div>
      )}
      <div style={uploadSection} id="app"/>
    </div>
  );
}


const answerClass = {
  color: '#012A59',
  marginBottom: '5%',
  textAlign: 'initial',
  marginLeft: "2rem",
}

const mainSt = {
  fontSize: '25px',
  fontWeigth: 'bold',
  textAlign: 'center',
  margin: '3%',
  textTransform: 'capitalize',
  color: 'rgba(34,117,215,.9)',
};

const stOff = {
  display: "none",
};
const stOn = {
  display: "flex",
  flexDirection: "column",
};

const questionStyle = {
  color: '#012A59',
  display: 'flex',
  marginLeft: '2rem',
  fontSize: '24px',
}

const uploadSection = {
  justifyContent: 'center',
  display: 'flex',
  marginTop: '1rem',
}

export default App;
