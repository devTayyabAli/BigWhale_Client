import React from "react";
import { Box, Card, Button, Typography } from "@mui/material";
import Icon from "src/@core/components/icon";

const RankCard = ({ rank }) => {
  const { title, starKey, qualified, directTeam, rewardPercentage } = rank;

  const renderStars = () => (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      {Array.from({ length: Number(starKey) || 0 }, (_, index) => (
        <Icon key={index} icon="bi:star-fill" fontSize={20} color={"#C9A84C"} />
      ))}
    </Box>
  );

  const directsValue = Math.min(directTeam?.value || 0, directTeam?.requiredValue || 0);

  return (
    <Card>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          pb: 3,
          borderBottom: 1,
        }}
      >
        {renderStars()}
        <Typography sx={{ fontWeight: 700, mt: 1 }}>
          Rank {starKey}: {title}
        </Typography>
        <Typography>{qualified ? "Qualified" : "Not Qualified"}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          borderBottom: 1,
        }}
      >
        <Box
          sx={{
            width: 200,
            height: 200,
            mb: 4,
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0D1224, #1A2342)",
            border: "1px solid rgba(201,168,76,0.5)",
          }}
        >
          <Typography sx={{ color: "rgba(200,215,245,0.7)", fontSize: "0.9rem", letterSpacing: "0.1em" }}>
            SALARY
          </Typography>
          <Typography sx={{ color: "#C9A84C", fontWeight: 800, fontSize: "3rem", lineHeight: 1.1 }}>
            {rewardPercentage}%
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          borderBottom: 1,
        }}
      >
        <Typography>
          <h1>Conditions</h1>
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          pb: 3,
          borderBottom: 1,
        }}
      >
        <Box>
          Direct Team :{directsValue} / {directTeam?.requiredValue || 0}{" "}
          <Typography
            variant="span"
            sx={{ color: qualified ? "green" : "#C9A84C", pl: 2, fontSize: 22 }}
          >
            {qualified ? "√" : "x"}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 6,
          pb: 6,
        }}
      >
        <Button type="submit" sx={{ mr: 2, py: 4 }} variant="contained">
          {qualified ? "Qualified" : "Not Qualified"}
        </Button>
      </Box>
    </Card>
  );
};

export default RankCard;
