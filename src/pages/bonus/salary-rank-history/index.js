// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Components
import { Card, Typography, CardHeader, Chip, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// ** Redux
import { useDispatch, useSelector } from "react-redux";
import { getSalaryRankHistory } from "src/store/apps/bonus/bonusSlice";

// ** Date formatting
import format from "date-fns/format";

const starLabel = (starKey) => "⭐".repeat(Number(starKey) || 0);

const SalaryRankHistory = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const dispatch = useDispatch();
  const { salaryRankHistory, status } = useSelector((state) => state.bonus);

  useEffect(() => {
    dispatch(
      getSalaryRankHistory({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      })
    );
  }, [dispatch, paginationModel]);

  const rows = (salaryRankHistory?.data?.salaryRankData ?? []).map((row, idx) => ({
    id: idx,
    ...row,
  }));

  const totalAmount = salaryRankHistory?.data?.totalAmount ?? 0;
  const totalItems  = salaryRankHistory?.paginate?.totalItems ?? 0;

  const columns = [
    {
      flex: 0.08,
      minWidth: 60,
      field: "id",
      headerName: "#",
      renderCell: ({ row }) => (
        <Typography sx={{ color: "text.secondary" }}>
          {row.id + 1 + paginationModel.page * paginationModel.pageSize}
        </Typography>
      ),
    },
    {
      flex: 0.18,
      minWidth: 150,
      field: "date",
      headerName: "DATE",
      renderCell: ({ row }) => (
        <Typography sx={{ color: "text.secondary" }}>
          {row.date ? format(new Date(row.date), "dd-MMM-yyyy HH:mm") : "—"}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 160,
      field: "rankTitle",
      headerName: "SALARY RANK",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontWeight: 600, color: "text.primary", fontSize: "0.85rem" }}>
            {starLabel(row.starKey)} Rank {row.starKey}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
            {row.rankTitle}
          </Typography>
        </Box>
      ),
    },
    {
      flex: 0.14,
      minWidth: 120,
      field: "rewardPercentage",
      headerName: "SALARY %",
      renderCell: ({ row }) => (
        <Chip
          label={`${row.rewardPercentage}%`}
          color="primary"
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      flex: 0.2,
      minWidth: 160,
      field: "amount",
      headerName: "SALARY EARNED (BW)",
      renderCell: ({ row }) => (
        <Typography sx={{ color: "success.main", fontWeight: 600 }}>
          {Number(row.amount).toFixed(8)} BW
        </Typography>
      ),
    },
  ];

  return status === "loading" ? (
    <Typography sx={{ p: 6 }}>Loading…</Typography>
  ) : (
    <Card>
      <CardHeader
        title={`💰 SALARY RANK HISTORY — Total Earned: ${Number(totalAmount).toFixed(4)} BW`}
        titleTypographyProps={{ sx: { mb: [2, 0], fontSize: "1rem", fontWeight: 700 } }}
        sx={{
          py: 4,
          flexDirection: ["column", "row"],
          "& .MuiCardHeader-action": { m: 0 },
          alignItems: ["flex-start", "center"],
        }}
      />
      <DataGrid
        autoHeight
        pagination
        paginationMode="server"
        rowCount={totalItems}
        rows={rows}
        rowHeight={62}
        columns={columns}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
  );
};

export default SalaryRankHistory;
