import { Room } from "../redux/reducers/roomReducer";

export interface Amenities {
  [key: string]: string | number | boolean;
}

export const amenities: Amenities[] = [
  {
    key: `banLa`,
    value: false,
    icon: "fas fa-tshirt",
    name: "Bàn là"
  },
  {
    key: "mayGiat",
    value: false,
    icon: "fas fa-tshirt",
    name: "Máy giặt"
  },
  {
    key: "tivi",
    value: false,
    icon: "fas fa-tv",
    name: "Tivi"
  },
  {
    key: "wifi",
    value: false,
    icon: "fas fa-wifi",
    name: "Wifi"
  },
  {
    key: "hoBoi",
    value: false,
    icon: "fas fa-swimming-pool",
    name: "Hồ bơi"
  },
  {
    key: "doXe",
    value: false,
    icon: "fas fa-parking",
    name: "Đỗ xe"
  },
  {
    key: "bep",
    value: false,
    icon: "fas fa-utensils",
    name: "Bếp"
  },
  {
    key: "dieuHoa",
    value: false,
    icon: "fas fa-snowflake",
    name: "Điều hoà"
  },
];

export const amenitiesNames: Amenities = {
  banLa: "Bàn là",
  bep: "Bếp",
  dieuHoa: "Điều hoà",
  doXe: "Chỗ đậu xe",
  hoBoi: "Hồ bơi",
  mayGiat: "Máy giặt",
  tivi: "Tivi",
  wifi: "Wifi",
};

export const getAmenities = (values: any, room: Room) => {
  for (const amenity of amenities) {
    amenity.value = values[amenity.key as keyof typeof room];
  }
  return [...amenities];
};
