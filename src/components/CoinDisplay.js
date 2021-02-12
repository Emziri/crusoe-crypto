import React, {useEffect,useState, useMemo} from 'react';

import CoinTable from './CoinTable';
import {toCurrency, toPercent, toDay, toPrecision, daysSince} from '../util/FormatUtil';
import './styles/CoinDisplay.css'

const CoinDisplay = () => {

	const[coins, setCoins] = useState([]);

	const columns = useMemo(() =>[
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
			accessor: "symbol",
			Cell: props => {return props.value.toUpperCase()}
		},
		{
			Header: "Price",
			accessor: "current_price",
			Cell: props => {return toCurrency(props.value, true)}
		},
		{
			Header: "Volume",
			accessor: "total_volume",
			Cell: props => {return toCurrency(props.value, false)}
		},
		{
			Header: "24h",
			accessor: "price_change_percentage_24h",
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
			Cell: props => {return toCurrency(props.value, false)}
		},
		{
			Header: "Circulating",
			accessor: "circulating_supply",
			Cell: props => {return toPrecision(props.value, 0)}
		},
		{
			Header: "All Time High",
			accessor: "ath", 
			Cell: props => {return toCurrency(props.value, true)}
		},
		{
			Header: "Days Since ATH",
			accessor: "ath_date",
			Cell: props => {return daysSince(props.value)}
		},
		{
			Header: "Percent Market Value",
			accessor: "percent_mv"
		}

	]);

	useEffect(() => {
		getCoins();

		const interval=setInterval(()=>{
			getCoins()
		}, 5000);

		return () =>clearInterval(interval);
	}, []);

	const getCoins = async () => {	
		try{
			const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

			const rHeaders = new Headers();
			rHeaders.append('pragma', 'no-cache');
			rHeaders.append('cache-control', 'no-cache');

			const reqInit = {
				method: 'GET',
				headers: rHeaders
			}

			const coinResponse = await fetch(url, reqInit);
			let coinData = await coinResponse.json();
			coinData = calcPercentMarketValue(coinData);

			setCoins(coinData);

		} catch (err) {
			console.error(err.message);
		}
	}

	const calcPercentMarketValue = (data) => {
		let totalMV = 0n;

		data.forEach((entry) => {
			totalMV += BigInt(entry.market_cap);
		});

		data.forEach((entry) => {
			let mCap = BigInt(entry.market_cap);

			let percMV = parseInt(mCap * 10000n / totalMV) / 10000;
			entry.percent_mv = toPercent(percMV);
		});

		return data;
	}

	return (
		<div className="CoinDisplay">
			<div className="coinsContainer">
				<CoinTable columns={columns} data={coins}/>
			</div>
		</div>
	);
}

export default CoinDisplay;