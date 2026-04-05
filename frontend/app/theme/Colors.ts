export type Theme = {
  colors: {
    beige: string;
    charcoal: string;
    amber: string;
    lightGray: string;
    white: string;
    black: string;
  };
  font: {
    heading: string;
    body: string;
  };
};

export const theme: Theme = {
  colors: {
    beige: "#F5F0E8",
    charcoal: "#1C1C1A",
    amber: "#D4A853",
    lightGray: "rgba(28,28,26,0.15)",
    white: "#FFFFFF",
    black: "#000000",
  },

  font: {
    heading: "'Georgia', 'Times New Roman', serif",
    body: "sans-serif",
  },
};
