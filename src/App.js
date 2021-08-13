import './App.css';
import React from 'react';


function App() {
  return (
    <div className="App">
      <header className="App-header">
       <Clock />
      </header>
    </div>
  );
}


class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.initialState = { breakLength: 5, 
                          sessionLength: 25,
                          clockState: "ready",
                          minutesLeft: 25,
                          secondsLeft: 0,
                          startButtonText: "start",
                          timeLeft: "25:00",
                          }

    this.state = this.initialState;
    this.handleClick = this.handleClick.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.decrementTimer = this.decrementTimer.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.timeLeft = this.timeLeft.bind(this)
    this.timerRef = React.createRef();
  }
  handleClick(attr, newVal) {
    let newState = {}
    if (attr === "break" ) {
     newState.breakLength = newVal;
     newState.minutesLeft = newVal;
    }
    else if (attr === "session" ) {
     newState.sessionLength = newVal;
     newState.minutesLeft = newVal;
     newState.timeLeft = this.timeLeft(newVal, this.state.secondsLeft);
    }
    this.setState(newState);
  }    
  handleReset() {
    clearInterval(this.timerRef.current)
    this.setState(this.initialState);
    let beep = document.getElementById("beep")
    beep.pause();
    beep.currentTime = 0;

  }
  startTimer() {
    let tickLength = 1000;
    let newState = {};
    if (this.state.clockState === "ready" ||
    this.state.clockState === "sessionPaused") {
      newState.clockState = "session";
      newState.startButtonText = "pause";
      this.setState(newState)
      this.timerRef.current = setInterval(this.decrementTimer, tickLength);
    }   
    else if (this.state.clockState === "breakPaused") {
      newState.clockState = "break";
      newState.startButtonText = "pause";
      this.setState(newState);
      this.timerRef.current = setInterval(this.decrementTimer, tickLength);
    }
    else if (this.state.clockState === "session") {
      newState.clockState = "sessionPaused";
      newState.startButtonText = "resume"; 
      clearInterval(this.timerRef.current);
      this.setState(newState);
    }
    else if (this.state.clockState === "break") {
      newState.clockState = "breakPaused";
      newState.startButtonText = "resume"; 
      clearInterval(this.timerRef.current);
      this.setState(newState);
    }
 
  }
 
  timeLeft(minutesLeft, secondsLeft) {
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
    if (this.state.secondsLeft >  0) {
      console.log("timeleft")
      newState.secondsLeft = this.state.secondsLeft - 1;
      newState.minutesLeft = this.state.minutesLeft;
    }
    //seconds at zero, but at least one minute remaining
     else if (this.state.secondsLeft === 0 &&
             this.state.minutesLeft > 0) {
       newState.secondsLeft = 59;
       newState.minutesLeft = this.state.minutesLeft - 1;
     }
    
    // if timer has reached zero minutes and zero seconds
    // toggle session/break
    else if (this.state.minutesLeft === 0 &&
    this.state.secondsLeft === 0) {
      if (this.state.clockState === "session") {
        newState.minutesLeft = this.state.breakLength;
        newState.clockState = "break";
      }
      else if (this.state.clockState === "break") {
        newState.minutesLeft = this.state.sessionLength;
        newState.clockState = "session"
      }
      let beep = document.getElementById("beep")
      beep.play()
      newState.secondsLeft = 0;
    }
   
    newState.timeLeft = this.timeLeft(newState.minutesLeft, 
                                      newState.secondsLeft)
    this.setState(newState);
   
    
  }
  render () {
    return (
      <div>
        <h1>Clock</h1>
        <p id="break-label">Break Length</p>
        <Button id = "break-decrement"
                buttonText = "-"
                attr = "break"
                newVal = {this.state.breakLength - 1}
                handler = {this.handleClick} />
        <Button id = "break-increment"
                buttonText = "+"
                attr = "break"
                newVal = {this.state.breakLength + 1}
                handler = {this.handleClick} />
        
        <p id="break-length">{this.state.breakLength}</p>
        <p id="session-label">Session Length</p>
        <Button id = "session-decrement"
                buttonText = "-"
                attr = "session"
                newVal = {this.state.sessionLength - 1}
                handler = {this.handleClick} />
        <Button id = "session-increment"
                buttonText = "+"
                attr = "session"
                newVal = {this.state.sessionLength + 1}
                handler = {this.handleClick} />
        
        <p id="session-length">{this.state.sessionLength}</p>
        <p id="timer-label">{this.state.clockState}</p>
        <p id="time-left">{this.state.timeLeft}</p>
        <audio 
          id = "beep"
          src = "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg">
          </audio>
        <button id = "start_stop"
                onClick = {this.startTimer}>
                  {this.state.startButtonText}</button>
        <button id = "reset"
                onClick = {this.handleReset}>reset</button>
      </div>
    )
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props)
    this.eventHandler = this.eventHandler.bind(this)

  }
  eventHandler() {
    if (this.props.newVal <= 60 && this.props.newVal >= 1) {
      this.props.handler( this.props.attr, this.props.newVal);  
    }
    

  }
  render() {
    return (
      <button id = {this.props.id}
              onClick = {this.eventHandler}>
              {this.props.buttonText}</button>
    )
    

  }
}


// ReactDOM.render(<App/>, document.getElementById('root'));


export default App;
