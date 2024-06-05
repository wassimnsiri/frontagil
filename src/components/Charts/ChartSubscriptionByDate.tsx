import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const ChartSubscriptionsByDate: React.FC = () => {
  const [state, setState] = useState({
    series: [{ name: 'Total Revenue', data: [] }],
  });

  const [options, setOptions] = useState<ApexOptions>({
    colors: ['#3C50E0', '#80CAEE'],
    chart: { fontFamily: 'Satoshi, sans-serif', type: 'bar', height: 335, stacked: true, toolbar: { show: false }, zoom: { enabled: false } },
    responsive: [{ breakpoint: 1536, options: { plotOptions: { bar: { borderRadius: 0, columnWidth: '25%' } } } }],
    plotOptions: { bar: { horizontal: false, borderRadius: 0, columnWidth: '25%', borderRadiusApplication: 'end', borderRadiusWhenStacked: 'last' } },
    dataLabels: { enabled: false },
    xaxis: { categories: [] },
    legend: { position: 'top', horizontalAlign: 'left', fontFamily: 'Satoshi', fontWeight: 500, fontSize: '14px', markers: { radius: 99 } },
    fill: { opacity: 1 },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3030/commande/revenue');
        const data = await response.json();
        const categories = data.map((item: { _id: any; }) => item._id);
        const seriesData = data.map((item: { totalprice: any; }) => Math.round(item.totalprice));

        setState({ series: [{ name: 'Total Revenue', data: seriesData }] });
        setOptions((prevOptions) => ({ ...prevOptions, xaxis: { ...prevOptions.xaxis, categories } }));
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">Revenue by Date</h4>
        </div>
      </div>
      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart options={options} series={state.series} type="bar" height={350} />
        </div>
      </div>
    </div>
  );
};

export default ChartSubscriptionsByDate;
