import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useEffect } from 'react';
import { fetchStatsSubscriptionByDate } from '../../network/stats_services';





interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartSubscriptionsByDate: React.FC = () => {
  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: 'Number of subscribers',
        data: [],
      },
     
    ],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStatsSubscriptionByDate();
        const subscriptionData = data.subscriptionstats || [];
        const categories = subscriptionData.map((item: { _id: any; }) => item._id);
        const seriesData = subscriptionData.map((item: { count: any; }) => Math.round(item.count));

        setState({
          series: [
            {
              name: 'Number of subscribers',
              data: seriesData,
            },
          ],
        });

        // Create a copy of options and update x-axis categories
        const updatedOptions = { ...options, xaxis: { ...options.xaxis, categories } };

        // Trigger a re-render
        handleReset(updatedOptions);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      }
    };

    fetchData();
  }, []);
  
  const handleReset = (updatedOptions: ApexOptions) => {
    setState((prevState) => ({
      ...prevState,
    }));
    setOptions(updatedOptions);
  };  
  const [options, setOptions]= useState<ApexOptions> ({
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
  
    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: '25%',
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: false,
    },
  
    xaxis: {
      categories: ['2024-03-07', 'T', 'W', 'T', 'F', 'S', 'S'],
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
  
      markers: {
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
  });

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Subsriptions by date
          </h4>
        </div>
        <div>
          <div className="relative z-20 inline-block">
          
           
          </div>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSubscriptionsByDate;
