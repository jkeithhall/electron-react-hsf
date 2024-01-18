// import { promises } from 'fs';

export default function Header({readFile}) {
  return (
    <header className="App-header">
      <h1>HSF Builder - PICASSO</h1>
      <input type="file" onChange={readFile} />
    </header>
  );
}