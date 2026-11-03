import type { Floor, Flot } from "../../dashboard/Building/types";

export const getUniqueFloorNumbers = (
  buildingFloors: Floor[],
  allFlots: Flot[],
): number[] => {
  return Array.from(
    new Set([
      ...buildingFloors.map((f) => Number(f.floorNo)),
      ...allFlots
        .map((u: any) => {
          const fNo =
            typeof u.floor === "object"
              ? u.floor?.floorNo
              : typeof u.floor === "number"
                ? u.floor
                : u.floorNo || u.floorNumber;
          return Number(fNo);
        })
        .filter((val) => Boolean(val) && !isNaN(val)),
    ]),
  ).sort((a, b) => a - b);
};

export const getUnitsForFloor = (
  allFlots: Flot[],
  floorNo: number,
  floorId?: string,
): Flot[] => {
  return allFlots.filter((u: any) => {
    const uFloorNo =
      typeof u.floor === "object"
        ? u.floor?.floorNo
        : typeof u.floor === "number"
          ? u.floor
          : u.floorNo || u.floorNumber;
    const uFloorId = typeof u.floor === "object" ? u.floor?._id : undefined;

    return (
      Number(uFloorNo) === Number(floorNo) ||
      (floorId && uFloorId === floorId) ||
      Number(u.floorNumber) === Number(floorNo) ||
      Number(u.floorNo) === Number(floorNo)
    );
  });
};

export const calculateTotalBillAmount = (unit: Flot): number => {
  return (
    unit.totalAmount ??
    (unit.baseFare || unit.baseRent || 0) +
      (unit.utilityBill || 0) +
      (unit.waterBill || unit.waterFee || 0) +
      (unit.gasBill || unit.gasFee || 0) +
      (unit.liftBill || unit.liftFee || 0) +
      (unit.garageBill || unit.parkingFee || 0) +
      (unit.dueBill || unit.dueAmount || 0)
  );
};

export const resolveUnitOccupancy = (
  unit: Flot,
  matchedUser?: any,
): { isOcc: boolean; tenantNameDisplay: string } => {
  const isOcc = Boolean(
    matchedUser ||
      unit.isAccupied ||
      unit.isOccupied ||
      unit.status === "ভাড়া দেওয়া" ||
      (unit.tenant && typeof unit.tenant === "object" && (unit.tenant as any).name) ||
      unit.tenantName,
  );

  const tenantNameDisplay = isOcc
    ? matchedUser?.name || unit.tenantName || unit.tenant?.name || "ভাড়াটিয়া"
    : "Empty";

  return { isOcc, tenantNameDisplay };
};
