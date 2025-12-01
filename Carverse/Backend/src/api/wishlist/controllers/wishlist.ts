/**
 * wishlist controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::wishlist.wishlist', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be authenticated to add items to wishlist');
    }

    // Find car by documentId using db query
    const car = await strapi.db.query('api::car.car').findOne({
      where: {
        documentId: data.carDocumentId,
      },
      populate: ['image', 'category'],
    });

    if (!car) {
      return ctx.badRequest('Car not found');
    }

    // Check if item already exists in wishlist for this user
    const existingItem = await strapi.db.query('api::wishlist.wishlist').findOne({
      where: {
        user: user.id,
        car: car.id,
      },
    });

    if (existingItem) {
      return ctx.badRequest('Car is already in your wishlist');
    }

    // Create wishlist item
    const wishlistItem = await strapi.entityService.create('api::wishlist.wishlist', {
      data: {
        car: car.id,
        user: user.id,
      },
      populate: {
        car: {
          populate: {
            image: true,
            category: true,
          },
        },
      },
    });

    return { data: wishlistItem };
  },

  async find(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be authenticated to view your wishlist');
    }

    // Get wishlist items for the current user using entityService for proper population
    const wishlistItems = await strapi.entityService.findMany('api::wishlist.wishlist', {
      filters: {
        user: {
          id: {
            $eq: user.id,
          },
        },
      },
      populate: {
        car: {
          populate: {
            image: true,
            category: true,
          },
        },
      },
    });

    return { data: wishlistItems };
  },

  async delete(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be authenticated to remove items from wishlist');
    }

    // Check if the wishlist item belongs to the user
    const wishlistItem = await strapi.db.query('api::wishlist.wishlist').findOne({
      where: {
        id: id,
      },
      populate: {
        user: true,
      },
    });

    if (!wishlistItem) {
      return ctx.notFound('Wishlist item not found');
    }

    // Check if user owns this wishlist item
    const wishlistUser = wishlistItem.user as any;
    if (wishlistUser && wishlistUser.id !== user.id) {
      return ctx.forbidden('You can only delete your own wishlist items');
    }

    // Delete the wishlist item
    const deletedItem = await strapi.entityService.delete('api::wishlist.wishlist', id);

    return { data: deletedItem };
  },
}));

