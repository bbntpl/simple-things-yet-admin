import './App.css';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {
	return (
		<Provider store={store}>
			<div className="App">
				<p>Hola todos</p>
			</div>
		</Provider >
	);
}

export default App;