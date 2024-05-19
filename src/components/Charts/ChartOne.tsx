import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { fetchmoviesStatsparRapportRating } from '../../network/movie_services';
interface Movie {
  title: string;
  averageRating: number;
}

const defaultOptions: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
  },
  xaxis: {
    type: 'category',
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 10,
  },
};

const ChartOne: React.FC = () => {
  const [series, setSeries] = useState<ApexAxisChartSeries>([]);
  const [xAxisCategories, setXAxisCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Movie[] = await fetchmoviesStatsparRapportRating(); // Define the expected return type
        const titles = data.map((movie) => movie.title);
        const ratings = data.map((movie) => movie.averageRating);


        setXAxisCategories(titles);
        setSeries([
          {
            name: 'Movie Ratings',
            data: ratings,
          },
        ]);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex justify-between items-start sm:flex-nowrap">
        <div className="flex gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div>
              <h1 className="font-semibold text-primary"> Film Rating</h1>
              
            </div>
          </div>
          <div className="flex min-w-47.5">
            
        
          </div>
        </div>
        <div className="flex">
          <div className="flex rounded-md bg-whiter p-1.5 dark:bg-meta-4">
           
          </div>
        </div>
      </div>

      <div className="-ml-5">
        <ReactApexChart
          options={{
            ...defaultOptions,
            xaxis: {
              ...defaultOptions.xaxis,
              categories: xAxisCategories,
            },
          }}
          series={series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default ChartOne;
