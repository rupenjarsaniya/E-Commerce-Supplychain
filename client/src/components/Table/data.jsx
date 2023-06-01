import { Button } from "@mantine/core";

export const data = [
  {
    orderAddress: "0x1234567890",
    actions: (
      <Button color="orange" size="xs" compact uppercase>
        Confirm
      </Button>
    ),
    status: "Placed",
  },
  {
    orderAddress: "0x1234567890",
    actions: (
      <Button color="indigo" size="xs" compact uppercase>
        Packaging
      </Button>
    ),
    status: "Confirmed",
  },
  {
    orderAddress: "0x1234567890",
    actions: (
      <Button color="yellow" size="xs" compact uppercase>
        Shipping
      </Button>
    ),
    status: "Packaging",
  },
  {
    orderAddress: "0x1234567890",
    actions: (
      <Button color="grape" size="xs" compact uppercase>
        Out for delivery
      </Button>
    ),
    status: "Shipping",
  },
  {
    orderAddress: "0x1234567890",
    actions: (
      <Button color="green" size="xs" compact uppercase>
        Delivered
      </Button>
    ),
    status: "Out For Delivery",
  },
  {
    orderAddress: "0x1234567890",
    actions: (
      <Button color="red" size="xs" compact uppercase>
        Cancel
      </Button>
    ),
    status: "Delivered",
  },
];
