export const Card = ({ children }) => {
  return <div className="bg-white rounded-lg shadow-md p-4">{children}</div>;
};

export const CardContent = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

export const CardHeader = ({ children }) => {
  return <div className="border-b p-4 font-bold text-lg">{children}</div>;
};

export const CardTitle = ({ children }) => {
  return <h3 className="text-xl font-semibold">{children}</h3>;
};

  