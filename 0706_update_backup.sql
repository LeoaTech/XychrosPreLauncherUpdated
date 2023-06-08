ALTER TABLE subscriptions_list RENAME COLUMN status to billing_status;

ALTER TABLE templates ADD COLUMN welcome_image_url TEXT;

UPDATE templates SET welcome_image_url = 'https://res.cloudinary.com/djcitu2qx/image/upload/v1686220689/WelcomeFood_e1yvnn.png' WHERE id = 2;

UPDATE templates SET welcome_image_url = 'https://res.cloudinary.com/djcitu2qx/image/upload/v1686220690/WelcomeFood2_mdxrpn.png' WHERE id = 3;

UPDATE templates SET welcome_image_url = 'https://res.cloudinary.com/djcitu2qx/image/upload/v1686220689/WelcomeNature_zl0rzu.png' WHERE id = 4;

UPDATE templates SET welcome_image_url = 'https://res.cloudinary.com/djcitu2qx/image/upload/v1686220689/WelcomeClothing_d1kzuy.png' WHERE id = 5;

UPDATE templates SET welcome_image_url = 'https://res.cloudinary.com/djcitu2qx/image/upload/v1686220689/WelcomeJewelry_ebkegg.png' WHERE id = 6;