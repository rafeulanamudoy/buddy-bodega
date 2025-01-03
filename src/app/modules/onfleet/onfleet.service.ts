import config from "../../../config";

const createOnfleetTask = async (order: any) => {
  try {
    const Onfleet = await import("@onfleet/node-onfleet");
    const onfleet = new Onfleet.default(config.onfleet.apiKey as string);

    const task = await onfleet.tasks.create({
      destination: {
        address: {
          street: order.customer.address,
          number: order.customer.zipCode,
          city: order.customer.city,
          state: order.customer.state,
          postalCode: order.customer.zipCode,
          country: order.customer.countryCode,
        },
      },
      recipients: [
        {
          name: `${order.customer.firstName} ${order.customer.lastName}`,
          phone: order.customer.phone,
        },
      ],
      notes: `Order ID: ${order.id}`,
      pickupTask: false,
    });

    console.log("Task Created:", task);
    return task;
  } catch (error) {
    console.error("Error creating Onfleet task:", error);
    throw error;
  }
};

export const OnfleetService = {
  createOnfleetTask,
};
