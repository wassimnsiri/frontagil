import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartThreeState {
  series: number[];
}

const options: ApexOptions = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'donut',
  },
  colors: ['#4CAF50', '#FF5733'],
  labels: ['Verified Users', 'Unverified Users'],
  legend: {
    show: false,
    position: 'bottom',
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartVerifiedUsers: React.FC = () => {
  const [state, setState] = useState<ChartThreeState>({
    series: [0, 0],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3030/user/wassim/stats');
        const data = await response.json();  // Ensure response is parsed as JSON

        const verifiedUsersCount = Math.round(data.verifiedUsersCount);
        const inverseUsersCount = Math.round(data.inverseUsersCount);
 
        setState({
          series: [verifiedUsersCount, inverseUsersCount],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Stats Verification Users 
          </h5>
        </div>
      
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#4CAF50]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-[#4CAF50] dark:text-white">
              <span> Verified </span>
              <span> {state.series[0]} </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#FF5733]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-[#FF5733] dark:text-white">
              <span> Unverified </span>
              <span>{state.series[1]}</span>

            </p>
          </div>
        </div>
       
        
      </div>
    </div>
  );
};

export default ChartVerifiedUsers;
