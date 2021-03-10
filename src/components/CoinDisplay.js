import React, {useEffect,useState, useMemo} from 'react';

import CoinTable from './CoinTable';
import {toCurrency, toPercent, toDay, toPrecision, daysSince} from '../util/FormatUtil';
import './styles/CoinDisplay.css'


/*
	Component to contruct and format data for using in the coinTable component
	Updates state from API call every 
*/

const CoinDisplay = () => {

	//Table data set as state
	const[coins, setCoins] = useState([]);

	const strippedSort = useMemo(() => (rowA, rowB, id) => {
		let valA = rowA.original[id];
		let valB = rowB.original[id];

		if(typeof valA === "string"){
			valA = Number(valA.replace(/(\%|^\$|,)/g, ''));
			valB = Number(valB.replace(/(\%|^\$|,)/g, ''));
		}
		
		return valA - valB;
	});

	//Columns specifications/cell formatting for use in table child component
	const columns = useMemo(() =>{
		return ([
		{
			Header: "Rank",
			accessor: "market_cap_rank"
		},
		{
			Header: "Name",
			accessor: "name"
		},
		{
			Header: "Symbol",
			accessor: "symbol"		
		},
		{
			Header: "Price",
			accessor: "current_price",
			sortType: strippedSort
		},
		{
			Header: "Volume",
			accessor: "total_volume",
			sortType: strippedSort
		},
		{
			Header: "24h",
			accessor: "price_change_percentage_24h",
			sortType: strippedSort,
			Cell: props => {
				let cngClr = "greenTxt"
				if(props.value < 0){
					cngClr = "redTxt"
				}

				return (
				<div className={cngClr}>{toPercent(props.value/100)}</div>
				)
			}
		},
		{
			Header: "Market Cap",
			accessor: "market_cap",
			sortType: strippedSort
		},
		{
			Header: "Circulating",
			accessor: "circulating_supply",
			sortType: strippedSort
		},
		{
			Header: "All Time High",
			accessor: "ath",
			sortType: strippedSort
		},
		{
			Header: "Days Since ATH",
			accessor: "days_since",
			sortType: strippedSort
		},
		{
			Header: "Percent Market Value",
			accessor: "percent_mv",
			sortType: strippedSort
		}

		]);
	});

	//initiate async API call every 5 seconds
	useEffect(() => {
		getCoins();

		const interval=setInterval(()=>{
			getCoins()
		}, 5000);

		return () =>clearInterval(interval);
	}, []);

	//Async call to get API data, make column calculations, and update state
	const getCoins = async () => {	
		try{
			const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

			//cache needs to always check from server if data's changed
			const rHeaders = new Headers();
			rHeaders.append('pragma', 'no-cache');
			rHeaders.append('cache-control', 'no-cache');

			const reqInit = {
				method: 'GET',
				headers: rHeaders
			}

			const coinResponse = await fetch(url, reqInit);
			let coinData = await coinResponse.json();
			coinData = structureData(coinData);


			setCoins(coinData);

		} catch (err) {
			console.error(err.message);
		}
	}

	//uses bigint to get percent of market cap to precision of 2 decimal places, formats for table
	const structureData = (data) => {
		let totalMV = 0n;

		data.forEach((entry) => {
			totalMV += BigInt(entry.market_cap);

			//formatting columns as we go, means table isn't constantly rerendering
			entry.days_since = daysSince(entry.ath_date);
			entry.symbol = entry.symbol.toUpperCase();
			entry.current_price = toCurrency(entry.current_price, true);
			entry.total_volume = toCurrency(entry.total_volume, false);
			entry.circulating_supply = toPrecision(entry.circulating_supply, 2);
			entry.ath = toCurrency(entry.ath, true);
		});

		data.forEach((entry) => {
			let mCap = BigInt(entry.market_cap);

			let percMV = parseInt(mCap * 10000n / totalMV) / 10000;
			entry.percent_mv = toPercent(percMV);
			entry.market_cap = toCurrency(entry.market_cap, false);
		});

		return data;
	}

	return (
		<div className="CoinDisplay">
			<h1>Cryptocurrency Data</h1>
			<div className="coinsContainer">
				<CoinTable columns={columns} data={coins}/>
			</div>
		</div>
	);
}

export default CoinDisplay;