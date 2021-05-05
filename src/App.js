import React from 'react';
import './App.css';
import Grid from './components/Grid.jsx'
import gridStyles from './css/grid.module.css'

function App() {
	return (
		<div className={gridStyles["text-center"]}>
			<Grid />
		</div>
	);
}

export default App;
