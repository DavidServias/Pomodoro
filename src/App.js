import './App.css';
import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

let initialState = {
  breakLength: 5,
  sessionLength: 25,
  clockState: "ready",
  minutesLeft: 25,
  secondsLeft: 0,
  startButtonText: "start",
  timeLeft: "25:00"

}

const reducer = function (state = initialState, action) {
  console.log("reducer called");
  switch (action.type) {
    case "UPDATE_BREAKLENGTH":
      return { ...state, breakLength: action.newVal };
    case "UPDATE_SESSIONLENGTH":
      return { ...state, sessionLength: action.newVal };
    case "UPDATE_MINUTESLEFT":
      return { ...state, minutesLeft: action.newVal };
    case "UPDATE_SECONDSLEFT":
      return { ...state, secondsLeft: action.newVal };
    case "UPDATE_CLOCKSTATE":
      return { ...state, clockState: action.newState };
    case "UPDATE_STARTBUTTONTEXT":
      return { ...state, startButtonText: action.newText };
    case "UPDATE_TIMELEFT":
      return { ...state, timeLeft: action.newTimeLeft };
    case "RESET_STATE":
      return {...initialState}
    default:
      return state;
  }
};

const updateBreakLength = (newVal) => {
  return { type: "UPDATE_BREAKLENGTH", newVal: newVal }
}
const updateSessionLength = (newVal) => {
  return { type: "UPDATE_SESSIONLENGTH", newVal: newVal }
}
const updateMinutesLeft = (newVal) => {
  return { type: "UPDATE_MINUTESLEFT", newVal: newVal }
}
const updateSecondsLeft = (newVal) => {
  return { type: "UPDATE_SECONDSLEFT", newVal: newVal }
}
const updateClockState = (newState) => {
  return { type: "UPDATE_CLOCKSTATE", newState: newState }
}
const updateStartButtonText = (newText) => {
  return { type: "UPDATE_STARTBUTTONTEXT", newText: newText }
}
const updateTimeLeft = (newTimeLeft) => {
  return { type: "UPDATE_TIMELEFT", newTimeLeft: newTimeLeft }
}
const resetState = () => {
  return { type: "RESET_STATE"}
}


let store = createStore(reducer);


const App = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <ClockContainer />
        </header>
      </div>
    </Provider>

  );
}


class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.initialState = {
      // breakLength: 5,
      // sessionLength: 25,
      // clockState: "ready",
      // minutesLeft: 25,
      //secondsLeft: 0,
      // startButtonText: "start",
      //timeLeft: "25:00",
    }

    this.state = this.initialState;
    this.handleClick = this.handleClick.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.decrementTimer = this.decrementTimer.bind(this)
    this.startTimer = this.startTimer.bind(this)
    // TO DO: this should maybe be renamed so as not to be confused with the prop
    this.timeLeftString = this.timeLeftString.bind(this)
    this.timerRef = React.createRef();
  }
  handleClick(attr, newVal) {
    let newState = {}
    if (attr === "break") {
      this.props.updateBreakLength(newVal);
      // this.props.updateMinutesLeft(newVal);
    }
    else if (attr === "session") {
      this.props.updateSessionLength(newVal);
      // this.props.updateMinutesLeft(newVal);
      this.props.updateTimeLeft(this.timeLeftString(newVal, this.props.secondsLeft));
      //newState.timeLeft = this.timeLeft(newVal, this.props.secondsLeft);
    }
    this.setState(newState);
  }
  handleReset() {
    clearInterval(this.timerRef.current)
    this.props.resetState();
    // this.setState(this.initialState);
    let beep = document.getElementById("beep")
    beep.pause();
    beep.currentTime = 0;

  }
  startTimer() {
    let tickLength = 200;
    let newState = {};
    if (this.props.clockState === "ready" ||
      this.props.clockState === "sessionPaused") {
      this.props.updateClockState("session");
      this.props.updateStartButtonText("pause");
      //newState.startButtonText = "pause";
      this.setState(newState)
      this.timerRef.current = setInterval(this.decrementTimer, tickLength);
    }
    else if (this.props.clockState === "breakPaused") {
      this.props.updateClockState("break");
      this.props.updateStartButtonText("pause");
      // newState.startButtonText = "pause";
      this.setState(newState);
      this.timerRef.current = setInterval(this.decrementTimer, tickLength);
    }
    else if (this.props.clockState === "session") {
      this.props.updateClockState("sessionPaused");
      this.props.updateStartButtonText("resume");
      // newState.startButtonText = "resume";
      clearInterval(this.timerRef.current);
      this.setState(newState);
    }
    else if (this.props.clockState === "break") {
      this.props.updateClockState("breakPaused");
      this.props.updateStartButtonText("resume");
      // newState.startButtonText = "resume";
      clearInterval(this.timerRef.current);
      this.setState(newState);
    }

  }

  timeLeftString(minutesLeft, secondsLeft) {
    // update seconds display
    let secondsDisplay
    if (secondsLeft >= 10) {
      secondsDisplay = secondsLeft.toString();
    }
    else if (secondsLeft < 10) {
      secondsDisplay = "0" + secondsLeft.toString();
    }
    // update minutes display
    let minutesDisplay
    if (minutesLeft >= 10) {
      minutesDisplay = minutesLeft;
    }
    else if (minutesLeft < 10) {
      minutesDisplay = "0" + minutesLeft;
    }
    let timeLeft = minutesDisplay + ":" + secondsDisplay
    return timeLeft

  }
  decrementTimer() {
    let newState = {};
    // if there is at least one second left, decrement second
    if (this.props.secondsLeft > 0) {
      console.log("timeleft")
      this.props.updateSecondsLeft(this.props.secondsLeft - 1);
      //this.props.updateMinutesLeft(minutesLeft);
      //newState.minutesLeft = this.state.minutesLeft;
    }
    //seconds at zero, but at least one minute remaining
    else if (this.props.secondsLeft === 0 &&
      this.props.minutesLeft > 0) {
      this.props.updateSecondsLeft(59);
      this.props.updateMinutesLeft(this.props.minutesLeft - 1);
    }

    // if timer has reached zero minutes and zero seconds
    // toggle session/break
    else if (this.props.minutesLeft === 0 &&
      this.props.secondsLeft === 0) {
      if (this.props.clockState === "session") {
        this.props.updateMinutesLeft(this.props.breakLength);
        this.props.updateClockState("break");
      }
      else if (this.props.clockState === "break") {
        this.props.updateMinutesLeft(this.props.sessionLength);
        this.props.updateClockState("session");
      }
      let beep = document.getElementById("beep")
      beep.play()
      this.props.updateSecondsLeft(0);
    }

    this.props.updateTimeLeft(this.timeLeftString(this.props.minutesLeft,
      this.props.secondsLeft));
    // newState.timeLeft = this.timeLeft(this.props.minutesLeft,
    //   this.props.secondsLeft);
    this.setState(newState);


  }
  render() {
    console.log(this.props)
    return (
      <div>
        <h1>Clock</h1>
        <div id="outer-box">
          <div id="break-container">
            <p id="break-label">Break Length</p>
            <Button id="break-decrement"
              buttonText="-"
              attr="break"
              newVal={this.props.breakLength - 1}
              handler={this.handleClick} />
            <Button id="break-increment"
              buttonText="+"
              attr="break"
              newVal={this.props.breakLength + 1}
              handler={this.handleClick} />

            <p id="break-length">{this.props.breakLength}</p>
          </div>

          <div id="session-container">
            <p id="session-label">Session Length</p>
            <Button id="session-decrement"
              buttonText="-"
              attr="session"
              newVal={this.props.sessionLength - 1}
              handler={this.handleClick} />
            <Button id="session-increment"
              buttonText="+"
              attr="session"
              newVal={this.props.sessionLength + 1}
              handler={this.handleClick} />

            <p id="session-length">{this.props.sessionLength}</p>
          </div>
        </div>

        <p id="timer-label">{this.props.clockState}</p>
        <p id="time-left">{this.props.timeLeft}</p>
        <audio
          id="beep"
          src="https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg">
        </audio>
        <button id="start_stop"
          onClick={this.startTimer}>
          {this.props.startButtonText}</button>
        <button id="reset"
          onClick={this.handleReset}>reset</button>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    breakLength: state.breakLength,
    sessionLength: state.sessionLength,
    clockState: state.clockState,
    minutesLeft: state.minutesLeft,
    secondsLeft: state.secondsLeft,
    startButtonText: state.startButtonText,
    timeLeft: state.timeLeft
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateBreakLength: (newVal) => dispatch(updateBreakLength(newVal)),
    updateSessionLength: (newVal) => dispatch(updateSessionLength(newVal)),
    updateMinutesLeft: (newVal) => dispatch(updateMinutesLeft(newVal)),
    updateSecondsLeft: (newVal) => dispatch(updateSecondsLeft(newVal)),
    updateClockState: (newState) => dispatch(updateClockState(newState)),
    updateStartButtonText: (newText) => dispatch(updateStartButtonText(newText)),
    updateTimeLeft: (newTimeLeft) => dispatch(updateTimeLeft(newTimeLeft)),
    resetState: () => dispatch(resetState())


  }
};

const ClockContainer = connect(mapStateToProps, mapDispatchToProps)(Clock);


class Button extends React.Component {
  constructor(props) {
    super(props)
    this.eventHandler = this.eventHandler.bind(this)

  }
  eventHandler() {
    if (this.props.newVal <= 60 && this.props.newVal >= 1) {
      this.props.handler(this.props.attr, this.props.newVal);
    }


  }
  render() {
    return (
      <button id={this.props.id}
        onClick={this.eventHandler}>
        {this.props.buttonText}</button>
    )


  }
}


// ReactDOM.render(<App/>, document.getElementById('root'));


export default App;
