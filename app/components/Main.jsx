import React from 'react';
import Answers from 'Answers';
import Popup from 'Popup';

const api = 'https://opentdb.com/api.php?amount=10';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nr: 0,
            total: 0, //data.length
            data: [],
            showButton: false,
            questionAnswered: false,
            score: 0,
            displayPopup: 'flex',
            started: 0,
        }
        this.nextQuestion = this.nextQuestion.bind(this);
        this.handleShowButton = this.handleShowButton.bind(this);
        this.handleStartQuiz = this.handleStartQuiz.bind(this);
        this.handleIncreaseScore = this.handleIncreaseScore.bind(this);
        this.setTestData = this.setTestData.bind(this);
    }

    setTestData( results ){
        this.setState({data: results, total: results.length} )
    }

    pushData(nr) {
        let {data} = this.state;
        let answers = data[nr].incorrect_answers;
        answers.push(data[nr].correct_answer);
        this.setState({
            question: data[nr].question,
            answers: answers,
            correct: data[nr].correct_answer,
            type: data[nr].type,
            nr: this.state.nr + 1
        });
    }

    componentWillMount() {
        const main = this;
        fetch(api)
            .then(response =>response.json())
            .then(function(resp){
                let results = resp.results;
                main.setTestData(results);
                let { nr } = main.state;
                main.pushData(nr);
            });
    }

    nextQuestion() {
        let { nr, total, score } = this.state;

        if(nr === total){
            this.setState({
                displayPopup: 'flex',
                started: 0,
            });
        } else {
            this.pushData(nr);
            this.setState({
                showButton: false,
                questionAnswered: false
            });
        }

    }

    handleShowButton() {
        this.setState({
            showButton: true,
            questionAnswered: true
        })
    }

    handleStartQuiz() {
        this.setState({
            displayPopup: 'none',
            nr: 1,
            started: 1,
        });
    }

    handleIncreaseScore() {
        this.setState({
            score: this.state.score + 1
        });
    }

    render() {
        let { nr, total, question, type, answers, correct, showButton, questionAnswered, displayPopup, score, started} = this.state;

        return (
            <div className="container">

                <Popup style={{display: displayPopup}} score={score} total={total} started={started} startQuiz={this.handleStartQuiz}/>

                <div className="row">
                    <div className="col-lg-10 col-lg-offset-1">
                        <div id="question">
                            <h4>Question {nr}/{total}</h4>
                            <p dangerouslySetInnerHTML={{ __html: question}}></p>
                        </div>
                        <Answers type={type}  answers={answers} correct={correct} showButton={this.handleShowButton} isAnswered={questionAnswered} increaseScore={this.handleIncreaseScore}/>
                        <div id="submit">
                            {showButton ? <button className="fancy-btn" onClick={this.nextQuestion} >{nr===total ? 'Finish quiz' : 'Next question'}</button> : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Main
