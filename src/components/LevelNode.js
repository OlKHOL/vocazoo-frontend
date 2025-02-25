import React from "react";
import { Box, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const LevelNode = ({
  level,
  currentLevel,
  expRequired,
  isLocked,
  hasBadge,
  isBlurred,
}) => {
  const isActive = level === currentLevel;
  const isPast = level < currentLevel;

  const NEON_SKY_BLUE = "#00E5FF";
  const SOFT_NEON_GLOW = `0 0 10px rgba(0, 229, 255, 0.3), 0 0 20px rgba(0, 229, 255, 0.2)`;
  const ACTIVE_GLOW = `0 0 15px rgba(0, 229, 255, 0.4), 0 0 30px rgba(0, 229, 255, 0.2)`;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        mb: { xs: 6, sm: 8 },
        opacity: isLocked ? 0.5 : 1,
        filter: isBlurred ? "blur(3px)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <Box
        sx={{
          width: { xs: "140px", sm: "180px" },
          height: { xs: "140px", sm: "180px" },
          position: "relative",
          borderRadius: "50%",
          background: isActive
            ? `radial-gradient(circle at 30% 30%, rgba(0, 229, 255, 0.4), #17202C)`
            : `radial-gradient(circle at 30% 30%, rgba(0, 229, 255, 0.15), #17202C)`,
          boxShadow: isActive ? ACTIVE_GLOW : "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: isActive ? "scale(1.1)" : "scale(1)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: SOFT_NEON_GLOW,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: "10%",
            left: "20%",
            width: "30%",
            height: "30%",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            filter: "blur(5px)",
          },
          border: isActive
            ? `2px solid rgba(0, 229, 255, 0.6)`
            : `2px solid rgba(0, 229, 255, 0.2)`,
        }}
      >
        <Typography
          sx={{
            color: isActive ? NEON_SKY_BLUE : "#FFFFFF",
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
            fontWeight: "bold",
            mb: 0.5,
            textShadow: isActive ? SOFT_NEON_GLOW : "none",
            opacity: isActive ? 0.9 : 0.8,
          }}
        >
          Level {level}
        </Typography>

        {isLocked ? (
          <LockIcon
            sx={{
              color: "#FFFFFF",
              fontSize: { xs: "1.5rem", sm: "2rem" },
              opacity: 0.6,
            }}
          />
        ) : (
          <>
            <Typography
              sx={{
                color: "#FFFFFF",
                opacity: 0.6,
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                mb: 0.5,
              }}
            >
              {expRequired} EXP
            </Typography>
            {hasBadge && (
              <EmojiEventsIcon
                sx={{
                  color: "#FFD700",
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  filter: "drop-shadow(0 0 3px rgba(255, 215, 0, 0.5))",
                  opacity: 0.9,
                }}
              />
            )}
          </>
        )}

        {isPast && (
          <Typography
            sx={{
              color: NEON_SKY_BLUE,
              fontSize: { xs: "0.7rem", sm: "0.8rem" },
              mt: 0.5,
              fontWeight: "bold",
              textShadow: SOFT_NEON_GLOW,
              opacity: 0.8,
            }}
          >
            COMPLETED
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LevelNode;
