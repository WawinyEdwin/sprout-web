import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChart } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatValue } from "./utils";

export const ProfessionalBarChart = ({
  data,
  title,
}: {
  data: any[];
  title: string;
}) => {
  return (
    <Card className="border-0 shadow-lg p-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => formatValue("amount", value)}
              labelFormatter={(label: string) => `Product: ${label}`}
            />
            <Bar dataKey="amount" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const SimpleBarChart = ({
  data,
  title,
}: {
  data: any[];
  title: string;
}) => {
  const totalAmount = data.reduce(
    (sum, item) => sum + Math.abs(item.amount),
    0
  );

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {data.map((item, index) => (
            <div
              key={item.product || index}
              className="flex items-center gap-2"
            >
              <span className="text-sm font-medium w-24 truncate">
                {item.product}
              </span>
              <div className="relative flex-grow h-4 bg-gray-200 rounded-full">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    width: `${(Math.abs(item.amount) / totalAmount) * 100}%`,
                    backgroundColor:
                      item.amount >= 0 ? "rgb(22 163 74)" : "rgb(220 38 38)",
                  }}
                ></div>
              </div>
              <span className="text-xs w-16 text-right">
                {formatValue("amount", item.amount)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
