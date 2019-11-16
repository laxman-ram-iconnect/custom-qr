import React from 'react';
import './App.css';
import axios from 'axios';

class App  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagePreviewUrl: '',
      selectedFile : null
    };
  }

  _handleSubmit = () => {
    const {selectedFile} = this.state;
    console.log(selectedFile)
    const data = new FormData() 
    data.append('file', selectedFile)
    console.log(data)
    axios.post("http://localhost:8000/upload", data, { 
      // receive two    parameter endpoint url ,form data
    }).then(res => { // then print response status
      console.log(res.statusText)
   })
    // TODO: do something with -> this.state.file
  }

  _handleImageChange = (e) => {
    
    let file = e.target.files[0];
    this.setState({
      selectedFile: e.target.files[0]
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

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} height='300' width='400'/>);
    }

    return (
      <div className="App">
        <form>
          <input type="file" onChange={this._handleImageChange} />
          <button type="button" onClick={this._handleSubmit}>Upload Image</button>
        </form>
        <br/>
        {$imagePreview}
      </div>
    )
  }
}

export default App;
