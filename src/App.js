import React from 'react';
import './App.css';
import axios from 'axios';

class App  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagePreviewUrl: '',
      selectedFile : null,
      input:null,
      qrCode: null
    };
  }

  _handleSubmit = (e) => {
    const {selectedFile } = this.state;
    const data = new FormData() 
    data.append('file', selectedFile)
    axios.post("http://localhost:8000/upload", data, { 
      // receive two    parameter endpoint url ,form data
    }).then(res => { // then print response status
      this.setState({qrCode: res.data});
      console.log(res.statusText)
   })
   e.preventDefault() 
    // TODO: do something with -> this.state.file
  }

  _handleImageChange = (e) => {
    
    let file = e.target.files[0];
    this.setState({
      selectedFile: e.target.files[0],
      input: null
    });
   
    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
    console.log('state', this.state, file)
  }


  updateCanvas =() => {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(0,0, 600, 250);
    ctx.restore();
    if(this.state.input == null) {
      return alert("Please enter data")
    }
    const inputArray = this.state.input.value ? this.state.input.value.split('') : [0];
    console.log( this.state.input)
    var obj = { 0 : 30, 1 : 115, 2: 230, 3:350, 4:470};
    let index = 0;
    inputArray.forEach(element => {
      if(element == 1) {
        this.drawCircle(obj[index]);
      }
      if(element == 3) {
        this.drawSquare(obj[index]);
      }
      if(element == 4) {
        this.drawRectangle(obj[index]);
      }
      if(element == 2) {
        this.drawTriangle(obj[index]);
      }
      if(element == 5) {
        this.drawPentagon(obj[index]);
      }
      index++;
    });
  }
  getUrl =() =>{
    if(this.refs.canvas) {
      const image = new Image();
      
      const data = this.refs.canvas.toDataURL('image/png');
      image.src = data;
      console.log(data);
            return  image;
    }
    return null;
  }
  drawCircle = (position) => {
      var context = this.refs.canvas.getContext('2d');
      var radius = 25;
      context.beginPath();
      context.arc(position, 53, radius, 0, 2 * Math.PI, false);
      context.fill();
      context.lineWidth = 5;
      context.stroke();
  }
  drawSquare = (position) => {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.rect(position, 30, 50, 50);
    ctx.fill();
    ctx.stroke();
  }
  
  drawRectangle = (position) => {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.rect(position, 30, 70, 50);
    ctx.fill();
    ctx.stroke();
  }

  drawTriangle = (position) => {
    var ctx = this.refs.canvas.getContext('2d');

        ctx.beginPath();
    ctx.moveTo(position , 80);
    ctx.lineTo(position+25,30);
    ctx.lineTo(position+50,80);
    ctx.lineTo(position,80);

            ctx.fill();
  }

  drawPentagon = (position) => {
    var cxt = this.refs.canvas.getContext('2d');
    // hexagon
    var numberOfSides = 5,
        size = 35,
        Xcenter = position + 10,
        Ycenter = 50,
        step  = 2 * Math.PI / numberOfSides,//Precalculate step value
        shift = (Math.PI / 180.0) * -18;//Quick fix ;)

    cxt.beginPath();
    //cxt.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          

    for (var i = 0; i <= numberOfSides;i++) {
    	var curStep = i * step + shift;
        cxt.lineTo (Xcenter + size * Math.cos(curStep), Ycenter + size * Math.sin(curStep));
    }

    cxt.strokeStyle = "#000000";
    cxt.lineWidth = 1;
    cxt.fill();
    cxt.stroke();
  }

_handleCanvasChange = (e) => {
  
  if(e.target.value.length > 6) {
    e.preventDefault() 
  }
  if(e.target.value.length < 6) {
    this.setState({input : { value : e.target.value}});  
  }
}

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} height='300' width='600'/>);
    }

    return (
      <div className="App">
        <h1>shapes.ai</h1>
        <form>
          <input type="file" onChange={this._handleImageChange} />
          <button type="button" onClick={this._handleSubmit}>Generate Code</button>
        </form>
        <br/>
        {$imagePreview}
        <br/>
        <form>
        <input type="text" onChange={this._handleCanvasChange} maxlength="5"/>
        <button type="button" onClick={this.updateCanvas}>Generate</button>
        
        <canvas ref="canvas" width={600} height={250}/>
        <h4> { this.state.qrCode} </h4>
        </form>
      </div>
    )
  }
}

export default App;
