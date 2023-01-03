<?php

namespace App\Controller\Admin;

use App\Entity\Event;
use EasyCorp\Bundle\EasyAdminBundle\Field\ArrayField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;

class EventCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Event::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->onlyOnIndex(),
            TextField::new('title'),
            TextEditorField::new('description'),
            MoneyField::new('price')
                ->setCurrency('EUR'),
            ImageField::new('cover')
                ->setBasePath('events/')
                ->setUploadDir('assets/images/events')
                ->setUploadedFileNamePattern('[randomhash].[extension]'),
            AssociationField::new('location', 'Lieux')
                ->setCrudController(LocationCrudController::class),
            AssociationField::new('category', 'Catégorie')
                ->setCrudController(CategoryCrudController::class),
            ArrayField::new('casting'),
            DateTimeField::new('date')
        ];
    }
}
