<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine if the user can manage other users (ban, kick, etc.)
     */
    public function manage(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if the user can ban another user
     */
    public function ban(User $user, User $targetUser): bool
    {
        return $user->isAdmin() && !$targetUser->isAdmin();
    }

    /**
     * Determine if the user can delete another user
     */
    public function delete(User $user, User $targetUser): bool
    {
        return $user->isAdmin() && !$targetUser->isAdmin() && $user->id !== $targetUser->id;
    }
}
