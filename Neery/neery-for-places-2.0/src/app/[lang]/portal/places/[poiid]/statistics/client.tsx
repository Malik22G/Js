import { useTranslation } from "@/app/[lang]/i18n/client";
import { GraphBreakdown } from "@/lib/api/statistics";
import { Bar, Line, Pie } from "react-chartjs-2";
import React from "react";
import Chart, {
  CategoryScale,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js/auto";
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GraphTypes {
  totalCount: { count: number };
  dailyBreakDown: GraphBreakdown;
  monthlyBreakDown: GraphBreakdown;
  acceptedRejected: GraphBreakdown;
  sourcesBreakdown: GraphBreakdown;
  reviewSourcesBreakdown: GraphBreakdown;
}

const plugins = [
  {
    id: "noData",
    afterDraw: function (chart: Chart) {
      if (chart.data.datasets[0].data.length < 1) {
        let ctx = chart.ctx;
        let width = chart.width;
        let height = chart.height;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "20px Arial";
        ctx.fillText("No data to display", width / 2, height / 2);
        ctx.restore();
      }
    },
  },
];

export function _Graphs({
  totalCount,
  dailyBreakDown,
  monthlyBreakDown,
  acceptedRejected,
  sourcesBreakdown,
  reviewSourcesBreakdown,
}: GraphTypes) {
  const { t } = useTranslation("portal/statistics");
  const { t: reviewTrans } = useTranslation("land");
  const year = new Date().getFullYear();
  return (
    <div>
      <div className="flex flex-row items-center shadow-2 py-2 px-4 rounded-2xl gap-2 max-w-fit">
        <div className="text-4xl text-primary-xlight font-bold rounded-full p-4 bg-primary">
          {totalCount.count}
        </div>
        <div className="text-lg">{t("totalCard")}</div>
      </div>
      <div className="mt-[10px] w-full lg:w-[700px]">
        <div className="flex flex-col mt-8 md:flex-row gap-12">
          <div className="flex-1 shadow-2 rounded-lg p-3">
            {monthlyBreakDown && (
              <Line
                height={"200px"}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: t("last30days"),
                      align: "center",
                      font: {
                        size: 14,
                      },
                      padding: {
                        top: 10,
                        bottom: 15,
                      },
                    },
                    legend: {
                      display: false,
                      position: "bottom",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1 },
                    },
                  },
                }}
                data={{
                  labels: monthlyBreakDown.labels,
                  datasets: [
                    {
                      label: `Last 30 Days Break Down ${year}`,
                      data: monthlyBreakDown.data,
                    },
                  ],
                }}
                plugins={plugins}
              />
            )}
          </div>
          <div className="flex-1 shadow-2 rounded-lg p-3">
            {dailyBreakDown && (
              <Line
                height={"200px"}
                data={{
                  labels: dailyBreakDown.labels,
                  datasets: [
                    {
                      label: `Last 7 Days Break Down ${year}`,
                      data: dailyBreakDown.data,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: t("last7days"),
                      align: "center",
                      font: {
                        size: 14,
                      },
                      padding: {
                        top: 10,
                        bottom: 15,
                      },
                    },
                    legend: {
                      display: false,
                      position: "bottom",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1 },
                    },
                  },
                }}
                plugins={plugins}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col mt-8 md:flex-row gap-12">
          <div className="flex-1 shadow-2 rounded-lg p-3">
            {acceptedRejected && (
              <Pie
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: t("resAcceptanceState"),
                      align: "center",
                      font: {
                        size: 14,
                      },
                      padding: {
                        top: 10,
                        bottom: 5,
                      },
                    },
                    subtitle: {
                      display: true,
                      text: t("allTime"),
                      padding: {
                        bottom: 10,
                      },
                    },
                    legend: {
                      display: true,
                      position: "bottom",
                    },
                  },
                }}
                data={{
                  labels: acceptedRejected.labels,
                  datasets: [
                    {
                      label: "",
                      data: acceptedRejected.data,
                    },
                  ],
                }}
                plugins={plugins}
              />
            )}
          </div>
          <div className="flex-1 shadow-2 rounded-lg p-3">
            {sourcesBreakdown && (
              <Pie
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: t("resSource"),
                      align: "center",
                      font: {
                        size: 14,
                      },
                      padding: {
                        top: 10,
                        bottom: 5,
                      },
                    },
                    subtitle: {
                      display: true,
                      text: t("allTime"),
                      padding: {
                        bottom: 10,
                      },
                    },
                    legend: {
                      display: true,
                      position: "bottom",
                    },
                  },
                }}
                data={{
                  labels: sourcesBreakdown.labels,
                  datasets: [
                    {
                      label: "",
                      data: sourcesBreakdown.data,
                    },
                  ],
                }}
                plugins={plugins}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col mt-8 md:flex-row gap-12">
          <div className="flex-1/2 shadow-2 rounded-lg p-3">
            {reviewSourcesBreakdown && (
              <Pie
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: t("revSource"),
                      align: "center",
                      font: {
                        size: 14,
                      },
                      padding: {
                        top: 10,
                        bottom: 5,
                      },
                    },
                    subtitle: {
                      display: true,
                      text: t("allTime"),
                      padding: {
                        bottom: 10,
                      },
                    },
                    legend: {
                      display: true,
                      position: "bottom",
                    },
                  },
                }}
                data={{
                  labels: reviewSourcesBreakdown.labels.map((label) =>
                    reviewTrans(`review.emailReview.${label}`).slice(0, -1)
                  ),
                  datasets: [
                    {
                      label: "",
                      data: reviewSourcesBreakdown.data,
                    },
                  ],
                }}
                plugins={plugins}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
